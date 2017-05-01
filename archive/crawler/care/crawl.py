import urllib2
import pymongo
import uuid
import html2text
from bson.objectid import ObjectId
from pymongo import MongoClient
from bs4 import BeautifulSoup
from slugify import slugify
import requests
import zlib
from time import gmtime, strftime
from HTMLParser import HTMLParser
import re
import datetime
from datetime import timedelta
from datetime import datetime
import Queue
import threading

import datetime
from datetime import timedelta
from datetime import datetime


#header
#AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11
snappy.hdr = {
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding':'gzip, deflate, sdch',
    'Accept-Language':'en-US,en;q=0.8',
    'Cache-Control':'no-cache',
    # open care.com in browser to get the cookie
    'Cookie': 'n_vis=dom-ord-prodwebapp-011432943053910; __utma=174140029.91310455.1432949254.1432952374.1432993726.3; __utmz=174140029.1432949254.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=174140029.|3=testCellInfo=1308%7C1409%7C1380=1; n_tc=1380%7C1308%7C1409%7C1234; __hstc=174140029.64b89f67937e10d717bc73f756389176.1432949264767.1432952374210.1432993748955.3; hsfirstvisit=https%3A%2F%2Fwww.care.com%2Fone-time-housekeeping-jobs||1432949264766; hubspotutk=64b89f67937e10d717bc73f756389176; mt.v=2.645124075.1432949264991; __qca=P0-873305103-1432949265609; lc=%7B%22syncedWithSession%22%3Atrue%2C%22geolocation%22%3Anull%2C%22overrideGeolocation%22%3Afalse%2C%22lastLocation%22%3Anull%2C%22access%22%3Afalse%7D; JSESSIONID=GoZet2R1Bq4R2LS9ACY3TPuc.dom-ord-prodwebapp-01; csc=dom-ord-prodwebapp-011432980030747; vc=f87fc101-4912-44c7-ac72-c071848346bf; ROUTE2=d; __utmb=174140029.2.9.1432993737538; __utmc=174140029; __utmt=1; __hssrc=1; __hssc=174140029.1.1432993748955; everyForm=%7B%22vertical%22%3A%22Children%22%2C%22seekerProvider%22%3A%22seeker%22%2C%22l2SelectedIndex%22%3A0%2C%22serviceId%22%3A%22CHILDCARE%22%7D',
    'Connection':'keep-alive',
    'Host':'www.care.com',
    'Pragma':'no-cache'
}



#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.care
content_collection = db.contents
location_collection = db.locations
tag_collection = db.tags
contact_collection = db.contacts


content_collection.drop()
tag_collection.drop()
location_collection.drop()
contact_collection.drop()


#insert contacts
def insert_contacts(collection,content_id,url,hdr):
    contacts_value = get_contacts(content_id,url,hdr)
    collection.insert(contacts_value)
# grab contacts
def get_contacts(content_id,url,hdr):
    return {
        'content_id': content_id,
        'email': '',
        'phone':''
    }

#insert location
def insert_location(collection,content_id,soap_object):
    location_value = get_location(content_id,soap_object)
    collection.insert(location_value)
# grab location
def get_location(content_id,soap_object):
    location = soap_object.find("div",{ "class" : "sub-headline" }).getText().split(',')
    city = ''
    state = ''
    if location is not None:
        city = location[0]
        state = location[1]

    location_value = {
        'content_id': content_id,
        'address': '',
        'city': city,
        'state': state,
        'zip': '',
        'loc': {
            'lon': None,
            'lat': None
        }
    }
    return location_value


#insert tags
def insert_tags(collection,content_id,soap_object):
    tags_value = get_tags(content_id,soap_object)
    for tag_value in tags_value:
        collection.insert(tag_value)
# grab tags
def get_tags(content_id,soap_object):
    return_tags = []
    return_tags.append({
        'content_id': content_id,
        'tag': ''
    })
    return return_tags



# insert content
def insert_content(collection,content_type,url,hdr):
    content_obj = get_content(url,content_type,hdr)

    if content_obj is None:
        return
    _id         = collection.insert(content_obj['content_value'])

    tags        = insert_tags(tag_collection,_id,content_obj['soap_object'])
    location    = insert_location(location_collection,_id,content_obj['soap_object'])
    contact     = insert_contacts(contact_collection,_id,url,hdr)
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

    soap_object = crawl(url,hdr)
    if soap_object is None:
        return
    # name
    name = html2text.html2text(soap_object.find("h1", { "class" : "headline" }).getText()).replace('\n',' ')
    #slug
    slug = slugify(name)
    # description
    description = str(soap_object.find("div", { "class" : "more-desc" })).replace('\n',' ')
    
    budget_dates = soap_object.findAll('div', {"class": "need"})
    # budget
    print budget_dates
    budget = None
    if len(budget_dates) > 2:
        budget = html2text.html2text(budget_dates[2].getText()).replace('\n',' ')
        date_str = html2text.html2text(budget_dates[1].getText()).replace('\n',' ')
        date_obj = datetime.strptime(date_str,'%a, %b %d, %Y  ')
   
    date_obj = datetime.today().date()
    date_obj = date_obj.strftime("%Y-%m-%d %H:%M:%S")

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

    return { 'content_value': content_value, 'soap_object': soap_object }


# grab all links
def get_links(url,hdr):
    links = []
    soap_object = crawl(url,hdr)

    urls = soap_object.findAll("a", { "class" : "profile-link" })
    for url in urls:
        link = url.get('href',None)
        if link is not None and 'javascript' not in link:
            links.append('http://www.care.com' + link)
    return links



# loop over links
def crawl(url,hdr):
    req = urllib2.Request(url, headers=hdr)
    try:
        conn = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        print ("There was an error: %r" % e)
        error_handle(url,'http error')
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
        decompressed_data=zlib.decompress(html, 16+zlib.MAX_WBITS)
        soup = BeautifulSoup(decompressed_data)
        return soup
                    


# error handler
def error_handle(url,e):
    print 'error url: ' + url
    # add to file
    with open("crawl_err.txt", "a") as myfile:
        myfile.write(url + '---' + e)


'''
for site in sites:
    links = get_links(site,hdr)

    for link in links:
        print link
        insert_content(content_collection,link,hdr)
'''


def build_sites(query):
    sites = []
    sites.append('https://www.care.com/' + query)
    sites.append('https://www.care.com/' + query + '-page2')
    sites.append('https://www.care.com/' + query + '-page3')
    sites.append('https://www.care.com/' + query + '-page4')
    sites.append('https://www.care.com/' + query + '-page5')
    sites.append('https://www.care.com/' + query + '-page6')
    sites.append('https://www.care.com/' + query + '-page7')
    sites.append('https://www.care.com/' + query + '-page8')
    sites.append('https://www.care.com/' + query + '-page9')
    sites.append('https://www.care.com/' + query + '-page10')
    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = ['one-time-housekeeping-jobs','seasonal-housekeeping-jobs','part-time-pet-sitting-jobs']

def put_get_content(q,content,content_type,link,hdr):
    q.put(insert_content(content,content_type,link,hdr))

for query in queries:
    for site in build_sites(query):
        print site
        links = get_links(site,hdr)
        print links
        for link in links:
            print link
            insert_content(content_collection,'care - ' + query,link,hdr)
''' 
for link in links:
    print 'url: ' + link
    t = threading.Thread(target=put_get_content, args = (q,content_collection,'care - ' + query,link,hdr))
    t.daemon = True
    t.start()

s = q.get()
print s
'''

