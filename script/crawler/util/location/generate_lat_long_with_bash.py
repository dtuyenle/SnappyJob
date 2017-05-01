import pycurl
import cStringIO
import urllib2
import urllib
import pymongo
import uuid
import html2text
from bson.objectid import ObjectId
from pymongo import MongoClient
from bs4 import BeautifulSoup
from slugify import slugify
from geolocation.google_maps import GoogleMaps
import re
import Queue
import threading
import json
from HTMLParser import HTMLParser
import sys

#tor
proxy_support = urllib2.ProxyHandler({"http" : "127.0.0.1:9050"})
opener = urllib2.build_opener(proxy_support) 
urllib2.install_opener(opener)

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

opener.addheaders = [('User-agent', 'Mozilla/5.0')]


#mongo connection
client = MongoClient('localhost',27017)

#fields
#db = client.care
db = client.indeed
#db = client.shiftgig
#db = client.ziprecruiter
#db = client.jobtocareer
#db = client.snagajob
#db = client.craiglist
#db = client.groovejob

#db = client.snappyjob


location_collection = db.locations
items = location_collection.find()[0:1000]

# spin up bunch of threads
q = Queue.Queue()

def put_get_content(q,item):
  q.put(insert_location(item))


#db.locations.find({ $where: 'typeof this.loc[0] != "number"' })
#db.collection.update( { "_id": ObjectId('5594a851340f21139a892153') },{ "loc": [21.332137,] },{ upsert: true } )
def insert_location(item):
  print item
  if str(item['_id']) == '5594a851340f21139a892153':
    print item

  if item['loc'][0] is not None and item['loc'][1] is not None:
    return None
  
  #if 'Ewa Beach' in item['city']:
  #  location_collection.update({'_id':item['_id']}, {"$set": {'city': 'Ewa Beach, HI' }}, upsert=False)
  #  return
  # build params from db
  if item['zip'] is None:
    item['zip'] = ''
  params = urllib.quote(str(item['city'].encode('utf-8')) + '+' + item['state'] + '+' + item['zip'])
  url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + params 
  #+ '&key=AIzaSyA5wYClAd_vqann9OAsw5kAQeelQWbjzSM'
  #AIzaSyA5wYClAd_vqann9OAsw5kAQeelQWbjzSM
  #AIzaSyAqOtRfWA80e3EBfBUJBO-cwGZuK1l36PY

  
   
  buf = cStringIO.StringIO()
 
  c = pycurl.Curl()
  c.setopt(c.URL, url)
  c.setopt(c.WRITEFUNCTION, buf.write)
  c.perform()
   
  print buf.getvalue()
  buf.close()


  # query google api for lat lon
  print url
  data = opener.open(url).read()
  data = json.loads(data)

  # check result
  if len(data['results']) == 0:
    print 'result'
    print data['results']
    location_collection.update({'_id':item['_id']}, {"$set": {'loc': [0,0] }}, upsert=False)
  else:

    if data['results'][0] is None:
      result = data['results']
    else:
      result = data['results'][0]

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
    if 'lat' in item['loc']:
      #print item
      item['loc'] = [0,0]

    if item['address'] is not None and item['loc'][0] is not None and item['loc'][1] is not None:
      print 'continue'
      continue

    #print item
    if item is not None:
      insert_location(item)
    '''t = threading.Thread(target=put_get_content, args = (q,item))
    t.daemon = True
    t.start()'''

'''s = q.get()
print s
'''


location_collection.ensure_index([("loc","2d")])
# index


