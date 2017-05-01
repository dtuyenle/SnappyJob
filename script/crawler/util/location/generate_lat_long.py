import urllib2
import urllib
import pymongo
import uuid
import html2text
from bson.objectid import ObjectId
from pymongo import MongoClient
from bs4 import BeautifulSoup
from slugify import slugify
from googlemaps import Client as GoogleMaps
import re
import Queue
import threading
import json
from HTMLParser import HTMLParser
import sys
from unidecode import unidecode


reload(sys)
sys.setdefaultencoding('utf8')

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

#db
#db = client.care
#db = client.indeed
#db = client.jobtocareer
#db = client.ziprecruiter
#db = client.snagajob
#db = client.groovejob
#db = client.shiftgig
#db = client.craiglist

#db = client.snappyjob


db = client.get_database(sys.argv[1])

location_collection = db.locations
items = location_collection.find()


# spin up bunch of threads
q = Queue.Queue()

def put_get_content(q,item):
    q.put(insert_location(item))


def insert_location(item):

    # build params from db
    if item['zip'] is None:
        item['zip'] = ''
    city =  unidecode(str(item['city']).decode('utf-8'))
    state = unidecode(str(item['state']).decode('utf-8'))
    params = urllib.quote(city + '+' + state + '+' + item['zip'])
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + params + '&key=AIzaSyA5wYClAd_vqann9OAsw5kAQeelQWbjzSM'
    #AIzaSyAqOtRfWA80e3EBfBUJBO-cwGZuK1l36PY

    # query google api for lat lon
    req   = urllib2.Request(url, headers=hdr)
    conn  = urllib2.urlopen(req)
    data  = json.loads(conn.read())

    print data
    # check result
    if len(data['results']) == 0:
        # if zero result
        location_collection.update({'_id':item['_id']}, {"$set": {'loc': [0,0] }}, upsert=False)
    else:
        # if result
        if data['results'][0] is None:
            result = data['results']
        else:
            result = data['results'][0]

        # get data to update
        if item['address'] is None or item['address'] == '':
            addr = result['formatted_address']
            location_collection.update({'_id':item['_id']}, {"$set": {'address': addr}}, upsert=False)

        if item['loc'][0] is None or item['loc'][1] is None or item['loc'][0] == 0 :
            lat = result['geometry']['location']['lat']
            lng = result['geometry']['location']['lng']
            if lat is None:
                lat = 0
            if lng is None:
                lng = 0

            print 'lat'
            print lat
            print'lon'
            print lng
            location_collection.update({'_id':item['_id']}, {"$set": {'loc': [lng,lat]}}, upsert=False)



for item in items:

    # normalize loc
    if 'lat' in item['loc']:
        item['loc'] = [None,None]
        print location_collection.update({'_id':item['_id']}, {"$set": {'loc': [0,0]}}, upsert=False)
    if item['loc'][0] == 0 and item['loc'][1] == 0:
        item['loc'] = [None,None]


    if item['address'] is not None and item['loc'][0] is not None and item['loc'][1] is not None:
        print 'continue'
        continue

    # check if data available in the db
    result = location_collection.find_one({
        'city'  : item['city'],
        'state' : item['state'],
        #'zip'   : item['zip']
    })
    insert = True
    if result is not None:
        if result['loc'] != [None,None]:
            if result['loc'] != [0,0]:
                if 'lat' not in result['loc']:
                    lng = result['loc'][0]
                    lat = result['loc'][1]
                    print [lng,lat]
                    print item['_id']
                    print location_collection.update({'_id':item['_id']}, {"$set": {'loc': [lng,lat]}}, upsert=False)
                    insert = False
    
    
    result = location_collection.find_one({
        'state' : item['state'],
        #'zip'   : item['zip']
    })
    print result
    if result['loc'] != [None,None]:
        if result['loc'] != [0,0]:
            if 'lat' not in result['loc']:
                lng = result['loc'][0]
                lat = result['loc'][1]
                print [lng,lat]
                print item['_id']
                print location_collection.update({'_id':item['_id']}, {"$set": {'loc': [lng,lat]}}, upsert=False)
                insert = False


    # some state format " NY distributed system"
    if len(item['state']) > 5 and item['state'] != '':
        item['state'] = item['state'][:3]
    result = location_collection.find_one({
        'city'  : item['city'],
        'state' : item['state'],
        #'zip'   : item['zip']
    })
    if result is not None:
        if result['loc'] != [None,None]:
            if result['loc'] != [0,0]:
                if 'lat' not in result['loc']:
                    lng = result['loc'][0]
                    lat = result['loc'][1]
                    print [lng,lat]
                    print item['_id']
                    print location_collection.update({'_id':item['_id']}, {"$set": {'loc': [lng,lat], 'state': item['state']}}, upsert=False)
                    insert = False
    

  

    if insert == True:
        insert_location(item)
    '''t = threading.Thread(target=put_get_content, args = (q,item))
    t.daemon = True
    t.start()'''

'''s = q.get()
print s
'''


location_collection.ensure_index([("loc","2d")])
# index


