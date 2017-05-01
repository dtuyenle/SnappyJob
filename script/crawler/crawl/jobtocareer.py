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
import urlparse
import re
import datetime
from datetime import timedelta
from unidecode import unidecode
import os

import snappy_class
snappy = snappy_class.SnappyContent('jobtocareer')

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

    zip = ''
    city = ''
    state = ''
    address = ''
    if soap_object is None:
        return
    link = soap_object.find('div',{'class':'job2'})
    if link is None: 
        return None
    click = link['onclick']
    params = click.split(',')
    print params

    if len(params) > 9 and len(params) < 15 and params[0] == "jc(0":
        zip =  params[8]
        city = params[9]
        state = params[10]
        address = city + ' , ' + state


    location_value = {
        'address': address,
        'city': city,
        'state': state,
        'zip': zip,
        'loc': [None,None]
    }
    return location_value

# grab tags
def get_tags(soap_object):
    if soap_object is None:
        return []
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
def get_content(soap_object,item_numb,url):

    if soap_object is None:
        return None

    # name
    print soap_object.find('div',{'class':'title'})
    if soap_object.find('div',{'class':'item-description'}) is not None:
        name = html2text.html2text(soap_object.find('div',{'class':'item-description'}).getText())
    else:
        name = ""
    #slug
    slug = slugify(name)
    # description
    if soap_object.find('div',{'class':'item-description'}) is not None:
        description = str(soap_object.find('div',{'class':'item-description' })).replace('\n',' ')
    else:
        description = None

    link = soap_object.find('div',{'class':'job2'})
    if link is None:
        return None
    click = link['onclick']
    params = click.split(',')
    print params

    if len(params) > 9 and len(params) < 15 and params[0] == "jc(0":
        url = "http://www.jobs2careers.com/click.php?id=" + params[1] + "&host_app=1" + "&job_loc=" + params[9] + ',' + params[10] + params[4] +'&org=&r=http://www.jobs2careers.com/results.php?q=&l=&r=1&jobtype=4&s=' + item_numb[0] + '&zip=' + params[8]

    # budget
    budget = None

    # date
    date_str = str(soap_object.find('span',{'itemprop':'datePosted' })).replace('\n',' ')
    date_int = re.findall('\d+', date_str)
    date_int = int(date_int[0])

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
        'no_details' : True
    }

    return { 'content_value': content_value, 'soap_object': soap_object }



def build_sites(query):
    sites = []
    sites.append('http://www.jobs2careers.com/results.php?q=&l=&r=1&sort=date&jobtype=4&s=' + str(query))
    sites.append('http://www.jobs2careers.com/results.php?q=&l=&r=1&sort=date&jobtype=2&s=' + str(query))

    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = []
for i in xrange(25):
    queries.append(i)

def put_get_content(q,site):
    parsed = urlparse.urlparse(site)
    item_numb = urlparse.parse_qs(parsed.query)['s']
    soap_object = snappy.crawl(site)

    snappy.loadContent(get_content(soap_object,item_numb,site))
    snappy.loadLocation(get_location(soap_object))
    snappy.loadTags(get_tags(soap_object))
    snappy.loadContact(get_contacts())
    snappy.insert_content()


for query in queries:
    for site in build_sites(query):
        
        parsed = urlparse.urlparse(site)
        item_numb = urlparse.parse_qs(parsed.query)['s']
        soap_object = snappy.crawl(site)

        snappy.loadContent(get_content(soap_object,item_numb,site))
        snappy.loadLocation(get_location(soap_object))
        snappy.loadTags(get_tags(soap_object))
        snappy.loadContact(get_contacts())
        snappy.insert_content()


        '''t = threading.Thread( target=put_get_content, args = (q,site) )
        t.daemon = True
        t.start()'''

os.kill(os.getpid(),1)
s = q.get()
    
