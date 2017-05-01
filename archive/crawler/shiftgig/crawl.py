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
import sys, json;
import requests

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
db = client.shiftgig
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



# grab content
def insert_content(content_collection,site,content_type,hdr):
    print site
    response = crawl(site,hdr)
    print response
    for item in response['data']:
        print item
        if '_id' in item.keys():
            name = item['business_title']
            slug = slugify(name)
            description = item['job_copy']
            budget = None
            url = 'http://www.shiftgig.com/applynow/' + item['_id']
            published_date = datetime.date.today().strftime("%Y-%m-%d %H:%M:%S")
            updated_date = datetime.date.today().strftime("%Y-%m-%d %H:%M:%S")
            if 'location_street' in item.keys():
                address = item['location_street'] + ' ' + item['location_city'] + ' ' + item['location_province']
            else:
                address = item['location_city'] + ' ' + item['location_province']
            city = item['location_city']
            state = item['location_province']
            postalCode = None
            if 'lat' in item.keys():
                lat = item['lat']
            else:
                lat = None

            if 'long' in item.keys():
                lon = item['long']
            else:
                lon = None

            content_value = {
                'name': name,
                'url': url,
                'slug': slug,
                'content_type': content_type,
                'description': description,
                'budget': budget,
                'publishedDate': published_date,
                'updatedDate': updated_date,
                'crawl' : True,
                'no_details' : False
            }
            if content_collection.find({'slug': slug}).count() == 0:
                _id         = content_collection.insert(content_value)
                location    = location_collection.insert({
                    'content_id': _id,
                    'address': address,
                    'city': city,
                    'state': state,
                    'zip': postalCode,
                    'loc': [lon,lat]
                })
                contact     = contact_collection.insert({
                    'content_id': _id,
                    'email': '',
                    'phone':''
                })
                content_collection.update({
                    '_id': _id
                },{
                    '$set': {
                        'tags_id'      : None,
                        'location_id'  : location,
                        'contact_id'   : contact
                    }
                }, upsert=False, multi=False)


# loop over links
def crawl(url,hdr):
    try:
        conn = requests.get(url,  headers=hdr, allow_redirects=True)
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
        response = conn.text
        print conn.text
        return json.loads(response)                    


# error handler
def error_handle(url,e):
    print 'error url: ' + url
    # add to file
    with open("crawl_err.txt", "a") as myfile:
        myfile.write(url + '---' + str(e) + '\n')



site1 = ["https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Atlanta,GA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Austin,TX&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Birmingham,AL&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Charlotte,NC&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Cincinatti,OH&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Cleveland,OH&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Chicago,IL&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Columbus,OH&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Dallas,TX&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Denver,CO&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Detroit,MI&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Hartford,CT&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Houston,TX&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Indianopolis,IN&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Jacksonville,FL&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Kansas City,MO&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Las Vegas,NV&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Los Angeles,CA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Louisville,KY&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Memphis,TN&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Miami,FL&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Milwaukee,WI&job_count=2"]
site2 = ["https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Minneapolis,MN&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Nashville,TN&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=New Orleans,LA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=New York,NY&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Oklahoma City,OK&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Philadelphia,PA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Phoenix,AZ&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Pittsburgh,PA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Portland,OR&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Providence,RI&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Raleigh,NC&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Richmond,VA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Sacramento,CA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Salt Lake City,UT&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=San Antonio,TX&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=San Diego,CA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=San Francisco,CA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Seattle,WA&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=St. Louis,MO&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Tampa,FL&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Toronto,ON&job_count=2","https://api.shiftgig.com/marketplace/jf/mixed-feed?search_type=place&name=Washington,DC&job_count=2"]
def build_sites():
    sites = []
    for site in site1:
        sites.append(site)
    for site in site2:
        sites.append(site)
    return sites

# spin up bunch of threads
q = Queue.Queue()



def put_get_content(q,content_collection,link,contentType,hdr):
    q.put(insert_content(content_collection,link,contentType,hdr))


for site in build_sites():
    print site
    #insert_content(content_collection,site,'shiftgig',hdr)
    t = threading.Thread(target=put_get_content, args = (q,content_collection,site,'shiftgig',hdr))
    t.daemon = True
    t.start()

s = q.get()
print s




            
