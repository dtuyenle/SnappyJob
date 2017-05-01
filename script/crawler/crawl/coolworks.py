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
from unidecode import unidecode
import os
import _strptime
from datetime import datetime
import snappy_class
snappy = snappy_class.SnappyContent('coolworks')


# grab contacts
def get_contacts():
    return {
        'email': '',
        'phone':''
    }

# grab location
def get_location(soap_object):
    address = soap_object.find("meta",{ "itemprop" : "addressLocality" })
    if address is not None:
        address = address.getText()
    state = soap_object.find('meta',{'itemprop':'addressRegion'})
    if address is not None:
        state = state.getText()
    location_value = {
        'address': address,
        'city': '',
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
def get_content(soap_object,url):

    # name
    if soap_object.find('h1') is not None:
        name = html2text.html2text(soap_object.find('h1').getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if soap_object.find("div", { "itemprop" : "description" }) is not None:
        description = str(soap_object.find("div", { "itemprop" : "description" })).replace('\n',' ')
    else:
        description = None
    # budget
    budget = None
    # date
    date_str = soap_object.find('span',{'itemprop':'datePosted'}).get('content')


    # published date
    published_date = datetime.strptime(date_str,"%b %d, %Y")
    # updated data
    updated_date = datetime.strptime(date_str,"%b %d, %Y")


    content_value = {
        'name': name,
        'url': url,
        'slug': slug,
        'description': description,
        'budget': budget,
        'publishedDate': published_date,
        'updatedDate': updated_date,
        'crawl' : True,
        'no_details' : False
    }

    return { 'content_value': content_value, 'soap_object': soap_object }


# grab all links
def get_links(url):
    links = []
    domain = ""
    soap_object = snappy.crawl(url)

    if soap_object is not None:
        urls = soap_object.findAll("div", { "class" : "job-listing" })

        for url in urls:
            link = url.find('a').get('href',None)
            if 'http' in link:
                links.append({'link': link})
            else:
                links.append({'link': 'http://www.coolworks.com/' + link})
    
    return links




def build_sites(query):
    sites = []
    sites.append('http://www.coolworks.com/search?page=' + str(query) + '&per_page=20')

    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []
for i in xrange(10):
    queries.append(i)


def put_get_content(q,link):
    soap_object = snappy.crawl(link['link'])
    snappy.loadContent(get_content(soap_object,link['link']))
    snappy.loadLocation(get_location(soap_object))
    snappy.loadTags(get_tags(soap_object))
    snappy.loadContact(get_contacts())
    snappy.insert_content()

for query in queries:
    for site in build_sites(query):
        for link in get_links(site):
            soap_object = snappy.crawl(link['link'])
            snappy.loadContent(get_content(soap_object,link['link']))
            snappy.loadLocation(get_location(soap_object))
            snappy.loadTags(get_tags(soap_object))
            snappy.loadContact(get_contacts())
            snappy.insert_content()
            
            '''t = threading.Thread( target=put_get_content, args = (q,link) )
            t.daemon = True
            t.start()'''

os.kill(os.getpid(),1)
s = q.get()

