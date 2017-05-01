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
from unidecode import unidecode

import os
import snappy_class
snappy = snappy_class.SnappyContent('simplyhired')


# grab contacts
def get_contacts():
    return {
        'email': '',
        'phone':''
    }


# grab location
def get_location(soap_object):
    city = ''
    if soap_object.find("span",{ "itemprop" : "addressLocality" }) is not None:
        city = soap_object.find("span",{ "itemprop" : "addressLocality" }).getText()
    state = soap_object.find("span",{ "itemprop" : "addressRegion" }).getText()
    address = soap_object.find("span",{ "itemprop" : "address" }).getText()


    location_value = {
        'address': address,
        'city': city,
        'state': state,
        'zip': '',
        'loc': [None,None]
    }
    return location_value



# grab tags
def get_tags(soap_object):
    return_tags = []
    tags_value = soap_object.findAll("span",{ "itemprop" : "title" })
    for tag_value in tags_value:
        tag = tag_value.getText()
        return_tags.append({
                'tag': tag
            })
    if len(return_tags) == 0:
        return_tags.append({
                'tag': ''
            })
    return return_tags


# grab content
def get_content(soap_object):
    # name
    if soap_object.find('a',{'itemprop':'title'}) is not None:
        name = html2text.html2text(soap_object.find('a',{'itemprop':'title'}).getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if soap_object.find("p", { "itemprop" : "description" }) is not None:
        description = str(soap_object.find("p", { "itemprop" : "description" })).replace('\n',' ')
    else:
        description = None
    # budget
    budget = None
    #url
    url = 'http://www.simplyhired.com' + soap_object.find("a", { "itemprop" : "title" }).get('href')
    # date
    date_str = soap_object.find("span", { "class" : "ago" }).getText()
    date_int = re.findall('\d+', date_str)
    if len(date_int) > 0:
        date_int = int(date_int[0])
    else:
        date_int = 1
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
        'description': description,
        'budget': budget,
        'publishedDate': published_date,
        'updatedDate': updated_date,
        'crawl' : True
    }
    return { 'content_value': content_value, 'soap_object': soap_object }


# grab all links
def get_links(url):
    links = []
    domain = ""
    soap_object = snappy.crawl(url)
    if soap_object is not None:
        urls = soap_object.findAll("li", { "class" : "result" })
        for url in urls:
            if url.find("a", { "itemprop" : "title" }) is not None:
                links.append(url)
    return links


def build_sites(query):
    sites = []
    sites.append('http://www.simplyhired.com/search?q=student&pn=' + str(query) )
    sites.append('http://www.simplyhired.com/search?q=part%20time&pn=' + str(query) )
    sites.append('http://www.simplyhired.com/search?q=occasional&pn=' + str(query) )
    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []

for i in xrange(25):
    queries.append(i)

def put_get_content(q,soap_object):
    snappy.loadContent(get_content(soap_object))
    snappy.loadLocation(get_location(soap_object))
    snappy.loadTags(get_tags(soap_object))
    snappy.loadContact(get_contacts())
    snappy.insert_content()


for query in queries:
    for site in build_sites(query):
        for soap_object in get_links(site):

            snappy.loadContent(get_content(soap_object))
            snappy.loadLocation(get_location(soap_object))
            snappy.loadTags(get_tags(soap_object))
            snappy.loadContact(get_contacts())
            snappy.insert_content()
            

            '''t = threading.Thread( target=put_get_content, args = (q,soap_object) )
            t.daemon = True
            t.start()'''

os.kill(os.getpid(),1)
s = q.get()




