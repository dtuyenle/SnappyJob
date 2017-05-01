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
import snappy_class
snappy = snappy_class.SnappyContent('groovejob')


# grab contacts
def get_contacts():
    return {
        'email': '',
        'phone':''
    }


# grab location
def get_location(soap_object):
    
    statecity = soap_object.find("div",{ "class" : "location" }).getText().split(',')
    city = statecity[0]
    state = ''
    if len(statecity) > 1:
        state = statecity[1]

    location_value = {
        'address': soap_object.find("div",{ "class" : "location" }).getText(),
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
    if soap_object.find('div',{'class':'titledesc'}) is not None:
        name = html2text.html2text(soap_object.find('div',{'class':'titledesc'}).findAll('span')[0].getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if len(soap_object.find('div',{'class':'titledesc'}).findAll('span')) > 1:
        description = html2text.html2text(soap_object.find('div',{'class':'titledesc'}).findAll('span')[1].getText())
    else:
        return None
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
        urls = soap_object.findAll("div", { "class" : " job" })
        for url in urls:
            links.append(url)
    return links


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






