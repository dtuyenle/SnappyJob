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
import sys
from unidecode import unidecode
import os
import snappy_class
snappy = snappy_class.SnappyContent('jobshiringnearme', False)




# grab contacts
def get_contacts():
    return {
        'email': '',
        'phone':''
    }


# grab location
def get_location(soap_object):
    
    items = soap_object.findAll('p')
    items[1]

    location_value = {
        'address': items[1].getText(),
        'city': '',
        'state': '',
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
    if soap_object.find('h3') is not None:
        name = html2text.html2text(soap_object.find('h3').getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if soap_object.findAll("p") is not None:
        description = ''
        for description_item in soap_object.findAll("p"): 
            description = description + ' ' + str(description_item.getText().encode('utf8').replace('\n',' '))
    else:
        description = None
    # budget
    budget = None
    #url
    url = soap_object.find("a").get('href')
    # date
    date_str = soap_object.find("span", { "class" : "realdate" }).getText()
   
    # published date
    published_date = datetime.strptime(date_str,"%a, %d %b %Y %H:%M:%S GMT")
    # updated data
    updated_date = datetime.strptime(date_str,"%a, %d %b %Y %H:%M:%S GMT")

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
    domain = ""
    soap_object = snappy.crawl(url)

    if soap_object is None:
        return None

    urls = [];

    script  = soap_object.findAll('script')[12]

    soup    = BeautifulSoup(script.string)
    
    h3      = soup.findAll('h3')
    p       = soup.findAll('p')
    total   = len(h3)

    for x in range(0, total):
        urls.append( BeautifulSoup( str(h3[x]) + str(p[x]) + str(p[x + 1]) + str(p[x + 2]) ) )

    return urls


def build_sites(query):
    sites = []
    sites.append('http://www.jobshiringnearme.net/US/+/Part-time?page=' + str(query) + '#jobresults' )


    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []
j = 1
#1400
for i in xrange(j,25):
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




