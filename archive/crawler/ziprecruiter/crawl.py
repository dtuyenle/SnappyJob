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
db = client.ziprecruiter
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
    address = soap_object.find("span",{ "itemprop" : "streetAddress" })
    if address is not None:
        address = address.getText()
    else:
        address = ''
    city = soap_object.find("span",{ "itemprop" : "addressLocality" })
    if city is not None:
        city = city.getText()
    else:
        city = ''
    state = soap_object.find("span",{ "itemprop" : "addressRegion" })
    if state is not None:
        state = state.getText()
    else:
        state = ''
    postalCode = soap_object.find("span",{ "itemprop" : "postalCode" })
    if postalCode is not None:
        postalCode = postalCode.getText()
    else:
        postalCode = ''

    location_value = {
        'content_id': content_id,
        'address': address,
        'city': city,
        'state': state,
        'zip': postalCode,
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
        return

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
    soap_object = crawl(url,hdr)
    if soap_object is not None:
        # name
        print soap_object.find('h1',{'itemprop':'description'})
        if soap_object.find('h1',{'itemprop':'description'}) is not None:
            name = html2text.html2text(soap_object.find('h1',{'itemprop':'description'}).getText())
        else:
            name = ""
        #slug
        slug = slugify(name)
        # description
        if soap_object.find("section", { "class" : "jobDescription" }) is not None:
            description = str(soap_object.find("section", { "class" : "jobDescription" })).replace('\n',' ')
        else:
            description = None
        # budget
        budget = None
        # published date
        published_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        # updated data
        updated_date = strftime("%Y-%m-%d %H:%M:%S", gmtime())

        content_value = {
            'name': name,
            'url': url,
            'slug': slug,
            'content_type': content_type,
            'description': description,
            'budget': budget,
            'publishedDate': published_date,
            'updatedDate': updated_date,
            'crawl' : True
        }

        return { 'content_value': content_value, 'soap_object': soap_object }
    return None

# grab all links
def get_links(url,hdr):
    links = []
    domain = ""
    soap_object = crawl(url,hdr)

    if soap_object is not None:
        urls = soap_object.findAll("a", { "itemprop" : "url" })
        for url in urls:
            link = url.get('href',None)
            if 'http' in link:
                links.append(link)
            else:
                links.append('https://www.ziprecruiter.com/candidate/search?search=Occasional&page=' + link)
    return links



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
    sites.append('https://www.ziprecruiter.com/candidate/search?search=Occasional&page=' + str(query) )
    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []
for i in xrange(100):
    queries.append(i)

def put_get_content(q,content,link,content_type,hdr):
    q.put(insert_content(content,link,content_type,hdr))



for query in queries:
    for site in build_sites(query):
        for url in get_links(site,hdr):
            insert_content(content_collection,url,'ziprecruiter - ' + str(query),hdr)
            '''t = threading.Thread(target=put_get_content, args = (q,content_collection,url,'ziprecruiter - ' + str(query),hdr))
            t.daemon = True
            t.start()'''

'''s = q.get()
print s
'''



