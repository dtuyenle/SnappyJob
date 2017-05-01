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
import re
import datetime
from datetime import timedelta
from datetime import datetime


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
db = client.groovejob
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
    
    statecity = soap_object.find("div",{ "class" : "location" }).getText().split(',')
    city = statecity[0]
    state = ''
    if len(statecity) > 1:
        state = statecity[1]

    location_value = {
        'content_id': content_id,
        'address': soap_object.find("div",{ "class" : "location" }).getText(),
        'city': city,
        'state': state,
        'zip': '',
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
def insert_content(collection,soap_object,content_type,hdr):
    content_obj = get_content(soap_object,content_type,hdr)

    # check if already in db
    check = collection.find({'slug': content_obj['content_value']['slug']})
    if check.count() == 0:
        _id         = collection.insert(content_obj['content_value'])
        #tags       = insert_tags(tag_collection,_id,content_obj['soap_object'])
        location    = insert_location(location_collection,_id,content_obj['soap_object'])
        contact     = insert_contacts(contact_collection,_id,hdr)
        collection.update({
            '_id': _id
        },{
            '$set': {
                'tags_id'      : None,
                'location_id'  : location,
                'contact_id'   : contact
            }
        }, upsert=False, multi=False)

# grab content
def get_content(soap_object,content_type,hdr):
    # name
    if soap_object.find('div',{'class':'titledesc'}) is not None:
        name = html2text.html2text(soap_object.find('div',{'class':'titledesc'}).findAll('span')[0].getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    description = html2text.html2text(soap_object.find('div',{'class':'titledesc'}).findAll('span')[1].getText())
    # budget
    budget = None

    #url
    url = soap_object.find("a").get('href')
    print url

    # date
    date_str = soap_object.find("div", { "class" : "dateposted" }).getText()
    date_obj = datetime.strptime(date_str,"%m/%d/%Y")
    # published date
    published_date = date_obj
    # updated data
    updated_date = date_obj

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
    print content_value
    return { 'content_value': content_value, 'soap_object': soap_object }


# grab all links
def get_links(url,hdr):
    links = []
    domain = ""
    soap_object = crawl(url,hdr)
    if soap_object is not None:
        urls = soap_object.findAll("div", { "class" : " job" })
        for url in urls:
            links.append(url)
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

    sites.append('http://www.groovejob.com/browse/jobs/in/ME/Maine/Portland/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/LA/Louisiana/Baton-Rouge/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Penfield/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/MD/Maryland/Barnesville/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/WA/Washington/Lacey/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/AL/Alabama/Dothan/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/TN/Tennessee/Knoxville/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Millbrook/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/TN/Tennessee/Sweetwater/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Elmsford/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NC/North-Carolina/Gastonia/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Valhalla/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/MI/Michigan/Bronson/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/WA/Washington/Olympia/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Wappinger/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/CA/California/San-Francisco/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/OH/Ohio/Youngstown/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Lakemont/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/WA/Washington/Kennewick/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/browse/jobs/in/NY/New-York/Hamilton/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_ME/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_LA/c_All-Locations/e_/r_30/p_' + str(query) )

    sites.append('http://www.groovejob.com/jobs/results/s_NY/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_MD/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_WA/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_AL/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_TN/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_NC/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_MI/c_All-Locations/e_/r_30/p_' + str(query) )

    sites.append('http://www.groovejob.com/jobs/results/s_CA/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_OH/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_NV/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_MO/c_All-Locations/e_/r_30/p_' + str(query) )


    sites.append('http://www.groovejob.com/jobs/results/s_TX/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_NJ/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_SC/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_PA/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_UT/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_FL/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_MA/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_NE/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_CT/c_All-Locations/e_/r_30/p_' + str(query) )
    sites.append('http://www.groovejob.com/jobs/results/s_MI/c_All-Locations/e_/r_30/p_' + str(query) )



    return sites

def load():
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
                #insert_content(content_collection,url,'groovejob - ' + str(query),hdr)
                t = threading.Thread(target=put_get_content, args = (q,content_collection,url,'groovejob - ' + str(query),hdr))
                t.daemon = True
                t.start()
    s = q.get()
    print s




