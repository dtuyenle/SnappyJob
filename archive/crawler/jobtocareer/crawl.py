import urllib2
import pymongo
import uuid
import html2text
from bson.objectid import ObjectId
from pymongo import MongoClient
from bs4 import BeautifulSoup
from slugify import slugify
import json
from pprint import pprint
import Queue
import threading
from time import gmtime, strftime
from HTMLParser import HTMLParser

import urlparse
import re
import datetime
from datetime import timedelta



class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

#header
#AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}

#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.jobtocareer
content_collection = db.contents
location_collection = db.locations
tag_collection = db.tags
contact_collection = db.contacts


content_collection.drop()
tag_collection.drop()
location_collection.drop()
contact_collection.drop()


#insert contacts
def insert_contacts(collection,content_id,hdr):
    contacts_value = get_contacts(content_id,hdr)
    return collection.insert(contacts_value)
# grab contacts
def get_contacts(content_id,hdr):
    return {
        'content_id': content_id,
        'email': '',
        'phone':''
    }

#insert location
def insert_location(collection,content_id,soap_object):
    location_value = get_location(content_id,soap_object)
    return collection.insert(location_value)
# grab location
def get_location(content_id,soap_object):

    zip = ''
    city = ''
    state = ''
    address = ''

    link = soap_object.find('div',{'class':'job2'})
    click = link['onclick']
    params = click.split(',')
    print params

    if len(params) > 9 and len(params) < 15 and params[0] == "jc(0":
        zip =  params[8]
        city = params[9]
        state = params[10]
        address = city + ' , ' + state


    location_value = {
        'content_id': content_id,
        'address': address,
        'city': city,
        'state': state,
        'zip': zip,
        'loc': [None,None]
    }
    return location_value


#insert tags
def insert_tags(collection,content_id,soap_object):
    tags_value = get_tags(content_id,soap_object)
    tags_array = []
    for tag_value in tags_value:
        id = collection.insert(tag_value)
        tags_array.append(id)
    return tags_array
# grab tags
def get_tags(content_id,soap_object):
    return_tags = []
    tags_value = soap_object.findAll("span",{ "itemprop" : "title" })
    for tag_value in tags_value:
        tag = tag_value.getText()
        return_tags.append({
                'content_id': content_id,
                'tag': tag
            })
    return return_tags



# insert content
def insert_content(collection,url,content_type,hdr):
    content_obj = get_content(url,content_type,hdr)

    if content_obj is None:
        return None

    # check if already in db
    check = collection.find({'slug': content_obj['content_value']['slug']})
    if check.count() == 0:
        _id         = collection.insert(content_obj['content_value'])
        tags        = insert_tags(tag_collection,_id,content_obj['soap_object'])
        location    = insert_location(location_collection,_id,content_obj['soap_object'])
        contact     = insert_contacts(contact_collection,_id,hdr)
        collection.update({
            '_id': _id
        },{
            '$set': {
                'tags_id'      : tags,
                'location_id'  : location,
                'contact_id'   : contact
            }
        }, upsert=False, multi=False)
# grab content
def get_content(url,content_type,hdr):
    print url

    parsed = urlparse.urlparse(url)
    item_numb = urlparse.parse_qs(parsed.query)['s']
    print item_numb
    soap_object = crawl(url,hdr)

    if soap_object is None:
        return None

    # name
    print soap_object.find('div',{'class':'title'})
    if soap_object.find('div',{'class':'item-description'}) is not None:
        name = html2text.html2text(soap_object.find('div',{'class':'item-description'}).getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if soap_object.find('div',{'class':'item-description'}) is not None:
        description = str(soap_object.find('div',{'class':'item-description' })).replace('\n',' ')
    else:
        description = None

    link = soap_object.find('div',{'class':'job2'})
    click = link['onclick']
    params = click.split(',')
    print params

    if len(params) > 9 and len(params) < 15 and params[0] == "jc(0":
        url = "http://www.jobs2careers.com/click.php?id=" + params[1] + "&host_app=1" + "&job_loc=" + params[9] + ',' + params[10] + params[4] +'&org=&r=http://www.jobs2careers.com/results.php?q=&l=&r=1&jobtype=4&s=' + item_numb[0] + '&zip=' + params[8]

    # budget
    budget = None

    # date
    date_str = str(soap_object.find('span',{'itemprop':'datePosted' })).replace('\n',' ')
    date_int = re.findall('\d+', date_str)
    date_int = int(date_int[0])

    if "week" in date_str:
        date_int = date_int * 7
    elif "month" in date_str:
        date_int = date_int * 30

    date_obj = datetime.date.today() - timedelta(days=date_int)
    # published date
    published_date = date_obj.strftime("%Y-%m-%d %H:%M:%S")
    # updated data
    updated_date =date_obj.strftime("%Y-%m-%d %H:%M:%S")

    content_value = {
        'name': name,
        'url': url,
        'slug': slug,
        'content_type': content_type,
        'description': description,
        'budget': budget,
        'publishedDate': published_date,
        'updatedDate': updated_date,
        'crawl' : True,
        'no_details' : True
    }

    return { 'content_value': content_value, 'soap_object': soap_object }



# loop over links
def crawl(url,hdr):
    req = urllib2.Request(url, headers=hdr)
    try:
        conn = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        print ("There was an error: %r" % e)
        error_handle(url,e.code)
    except urllib2.URLError as e:
        print ("There was an error: %r" % e)
        error_handle(url,'url error')
    except ValueError, e:
        print ("There was an error: %r" % e)
        error_handle(url,'unicode error')
    except:
        print ("There was an error: unkown")
        error_handle(url,'unknown error')
    else:
        html = conn.read()
        soup = BeautifulSoup(html)
        return soup
                    


# error handler
def error_handle(url,e):
    print 'error url: ' + url
    # add to file
    with open("crawl_err.txt", "a") as myfile:
        myfile.write(url + '---' + str(e) + '\n')


def build_sites(query):
    sites = []
    sites.append('http://www.jobs2careers.com/results.php?q=&l=&r=1&sort=date&jobtype=4&s=' + str(query))
    sites.append('http://www.jobs2careers.com/results.php?q=&l=&r=1&sort=date&jobtype=2&s=' + str(query))

    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []
for i in xrange(300):
    queries.append(i)

def put_get_content(q,content,link,content_type,hdr):
    q.put(insert_content(content,link,content_type,hdr))



for query in queries:
    for site in build_sites(query):
        insert_content(content_collection,site,'jobtocareer - ' + str(query),hdr)
        '''t = threading.Thread(target=put_get_content, args = (q,content_collection,site,'jobtocareer - ' + str(query),hdr))
        t.daemon = True
        t.start()'''
        
'''s = q.get()
print s'''


