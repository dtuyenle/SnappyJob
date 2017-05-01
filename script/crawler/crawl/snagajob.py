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
snappy = snappy_class.SnappyContent('snagajob')


# grab contacts
def get_contacts():
    return {
        'email': '',
        'phone':''
    }

# grab location
def get_location(soap_object):
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
        'address': address,
        'city': city,
        'state': state,
        'zip': postalCode,
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
def get_content(soap_object,date_str,url):

    # name
    if soap_object.find('h1',{'itemprop':'description'}) is not None:
        title = unidecode(str(soap_object.find('h1',{'itemprop':'description'}).getText().encode('utf-8')))
        print title
        name = html2text.html2text(title)
    else:
        name = ""
    #slug
    slug = slugify(name + ' ' + date_str)
    # description
    if soap_object.find("section", { "class" : "jobDescription" }) is not None:
        description = str(soap_object.find("section", { "class" : "jobDescription" })).replace('\n',' ')
    else:
        description = None
    # budget
    budget = None
    # date
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
        urls = soap_object.findAll("a", { "itemprop" : "url" })
        date_strs = soap_object.findAll("div", { "class" : "updated" })
        for url, date_str in zip(urls, date_strs):
            link = url.get('href',None)
            date_str = date_str.getText()
            if 'http' in link:
                links.append({'link': link, 'date_str': date_str})
            else:
                links.append({'link': 'http://www.snagajob.com' + link, 'date_str': date_str})
    
    return links




def build_sites(query):
    sites = []
    sites.append('http://www.snagajob.com/job-search/q-occasional/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-teen/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/t-part+time/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-cashier/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-cook/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-delivery+driver/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-host/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-hostess/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-stock+clerk/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-customer+service/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-merchandiser/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-retail+sales/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/q-student/page-' + str(query) + '?ui=true&sort=date')
    sites.append('http://www.snagajob.com/job-search/hourly-job/page-' + str(query) + '?ui=true&sort=date')

    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []
for i in xrange(25):
    queries.append(i)


def put_get_content(q,link):
    soap_object = snappy.crawl(link['link'])
    snappy.loadContent(get_content(soap_object,link['date_str'],link['link']))
    snappy.loadLocation(get_location(soap_object))
    snappy.loadTags(get_tags(soap_object))
    snappy.loadContact(get_contacts())
    snappy.insert_content()

for query in queries:
    for site in build_sites(query):
        for link in get_links(site):
            soap_object = snappy.crawl(link['link'])
            snappy.loadContent(get_content(soap_object,link['date_str'],link['link']))
            snappy.loadLocation(get_location(soap_object))
            snappy.loadTags(get_tags(soap_object))
            snappy.loadContact(get_contacts())
            snappy.insert_content()

            '''t = threading.Thread( target=put_get_content, args = (q,link) )
            t.daemon = True
            t.start()'''

os.kill(os.getpid(),1)
s = q.get()



