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
snappy = snappy_class.SnappyContent('linkedin')


# grab contacts
def get_contacts(soap_object):
    if soap_object.find("span",{ "class" : "company-name-text" }) is not None:
        email = soap_object.find("span",{ "class" : "company-name-text" }).getText()
    else:
        email = ''
    return {
        'email': email,
        'phone': ''
    }


# grab location
def get_location(soap_object):
    if soap_object.find("span",{ "class" : "job-location" }) is not None:
        statecity = soap_object.find("span",{ "class" : "job-location" }).getText().split(',')
        addr = soap_object.find("span",{ "class" : "job-location" }).getText()
    else:
        statecity = "US-Multiple, Locations-Multiple Locations".split(',')
        addr = "USA"
    city = statecity[0]
    state = ''
    if len(statecity) > 1:
        state = statecity[1]

    location_value = {
        'address': addr,
        'city': city,
        'state': state,
        'zip': '',
        'loc': [None,None]
    }
    return location_value



# grab tags
def get_tags(soap_object):
    return_tags = []
    tags_value = soap_object.findAll("h4",{ "class" : "job-text" })
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
    if soap_object.find('h2',{'class':'job-title'}) is not None:
        name = html2text.html2text(soap_object.find('h2',{'class':'job-title'}).getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if soap_object.find("div", { "class" : "job-description" }) is not None:
        name = str( soap_object.find("span", { "class" : "company-name-text" }) ).replace('\n',' ')
        description = name + ' - '+ str( soap_object.find("div", { "class" : "job-description" }) ).replace('\n',' ')
    else:
        description = None
    #url
    url = soap_object.find("h2", {"class" : "job-title"}).find("a").get('href')
    # date
    if soap_object.find("span", {"class" : "job-date-posted"}) is not None:
        date_str = soap_object.find("span", {"class" : "job-date-posted"}).getText()
    else:
        date_str = "1";
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
        'budget': '',
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
        urls = soap_object.findAll("li", { "class" : "job-listing" })
        for url in urls:
            if url.find("h2", { "class" : "job-title" }) is not None:
                links.append(url)
    return links


def build_sites(query):
    sites = []
    sites.append('https://www.linkedin.com/jobs/search?keywords=Information+Technology+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    sites.append('https://www.linkedin.com/jobs/search?keywords=Engineering+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    sites.append('https://www.linkedin.com/jobs/search?keywords=Finance+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    sites.append('https://www.linkedin.com/jobs/search?keywords=Management+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    sites.append('https://www.linkedin.com/jobs/search?keywords=Marketing+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    sites.append('https://www.linkedin.com/jobs/search?keywords=Research+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    sites.append('https://www.linkedin.com/jobs/search?keywords=Sales+Internship&locationId=us:0&count=50&trk=jobs_jserp_posted_one_week&f_TP=1,2&start=' + str(query) )
    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []

for i in xrange(25):
    queries.append(i * 25)

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
            snappy.loadContact( get_contacts(soap_object) )
            snappy.insert_content()

            '''t = threading.Thread( target=put_get_content, args = (q,soap_object) )
            t.daemon = True
            t.start()'''

os.kill(os.getpid(),1)
s = q.get()




