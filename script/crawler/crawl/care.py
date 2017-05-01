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
import os

import datetime
from datetime import timedelta
from datetime import datetime

import snappy_class
snappy = snappy_class.SnappyContent('care')
snappy.hdr = {
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36',
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding':'gzip, deflate, sdch',
    'Accept-Language':'en-US,en;q=0.8',
    'Cache-Control':'no-cache',
    # open care.com in browser to get the cookie
    'Cookie': 'n_tc=1191%7C1308%7C1380%7C1286%7C1234; mt.v=2.283603359.1433558150693; __utma=174140029.1052334686.1433558152.1434906449.1436926286.5; __utmz=174140029.1433558152.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __hstc=174140029.7e5a41f2ffc7f7dca4b4e49b58ae28e3.1433558153452.1434906461782.1436926287709.4; hsfirstvisit=https%3A%2F%2Fwww.care.com%2F||1433558153450; hubspotutk=7e5a41f2ffc7f7dca4b4e49b58ae28e3; __qca=P0-1588461042-1433558154545; __utmv=174140029.|3=testCellInfo=1234%7C1286%7C1380=1; lc=%7B%22syncedWithSession%22%3Atrue%2C%22geolocation%22%3Anull%2C%22overrideGeolocation%22%3Afalse%2C%22lastLocation%22%3Anull%2C%22access%22%3Afalse%7D; plvj=5649590; csc=dom-ord-prodwebapp-101436692646921; vc=834196cd-e7b6-4816-8d50-6b6c85e33a9e; ROUTE2=d; __utmb=174140029.4.10.1436926286; __utmc=174140029; __utmt=1; __hssrc=1; __hssc=174140029.4.1436926287709; everyForm=%7B%22vertical%22%3A%22Children%22%2C%22seekerProvider%22%3A%22sitter%22%2C%22l2SelectedIndex%22%3A0%2C%22serviceId%22%3A%22CHILDCARE%22%7D',
    'Connection':'keep-alive',
    'Host':'www.care.com',
    'Pragma':'no-cache'
}


# grab contacts
def get_contacts():
    return {
        'email': '',
        'phone':''
    }


# grab location
def get_location(soap_object):
    if soap_object is None:
        return None
    location = soap_object.find("div",{ "class" : "sub-headline" }).getText().split(',')
    city = ''
    state = ''
    if location is not None:
        city = location[0]
        state = location[1]

    location_value = {
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



# grab tags
def get_tags(soap_object):
    return_tags = []
    return_tags.append({
        'tag': ''
    })
    return return_tags

# grab content
def get_content(soap_object,url):

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
    budget = None
    if len(budget_dates) > 2:
        budget = html2text.html2text(budget_dates[2].getText()).replace('\n',' ')
        date_str = html2text.html2text(budget_dates[1].getText()).replace('\n',' ')
        date_obj = datetime.strptime(date_str,'%a, %b %d, %Y  ')
        print date_obj
    else:
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
    soap_object = snappy.crawl(url, True)

    if soap_object is None:
        return links
    urls = soap_object.findAll("a", { "class" : "profile-link" })
    for url in urls:
        link = url.get('href',None)
        if link is not None and 'javascript' not in link:
            links.append('http://www.care.com' + link)
    return links


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

def put_get_content(q,link):
    soap_object = snappy.crawl(link,True)

    snappy.loadContent(get_content(soap_object,link))
    snappy.loadLocation(get_location(soap_object))
    snappy.loadTags(get_tags(soap_object))
    snappy.loadContact(get_contacts())
    snappy.insert_content()

for query in queries:
    for site in build_sites(query):
        links = get_links(site)
        for link in links:
            soap_object = snappy.crawl(link,True)

            snappy.loadContent(get_content(soap_object,link))
            snappy.loadLocation(get_location(soap_object))
            snappy.loadTags(get_tags(soap_object))
            snappy.loadContact(get_contacts())
            snappy.insert_content()

            '''t = threading.Thread( target=put_get_content, args = (q,link) )
            t.daemon = True
            t.start()'''

os.kill(os.getpid(),1)
s = q.get()
