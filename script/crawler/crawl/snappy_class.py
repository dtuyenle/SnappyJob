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
import zlib
import sys
from datetime import date, timedelta
import random



class SnappyContent:

    def __init__(self,db_name,check = False):

        # header
        self.hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
                   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
                   'Accept-Encoding': 'none',
                   'Accept-Language': 'en-US,en;q=0.8',
                   'Connection': 'keep-alive'}

        # mongo connection
        client = MongoClient('localhost',27017)

        # fields
        self.check               = check
        self.db_name             = db_name
        self.db                  = client.get_database(db_name)
        self.content_collection  = self.db.contents
        self.location_collection = self.db.locations
        self.tag_collection      = self.db.tags
        self.contact_collection  = self.db.contacts

        self.content_collection.drop()
        self.tag_collection.drop()
        self.location_collection.drop()
        self.contact_collection.drop()

    def loadContent(self,content):
        self.content_data = content
    def loadLocation(self,location):
        self.location_data = location
    def loadTags(self,tags):
        self.tags_data = tags
    def loadContact(self,contact):
        self.contact_data = contact

    def insert_content(self):
        if self.content_data is None or self.location_data is None:
            return None

        publishedDate = datetime.datetime.strptime(str(self.content_data['content_value']['publishedDate']), "%Y-%m-%d %H:%M:%S") 
        daysago = datetime.datetime.now() - timedelta(days=4)

        print publishedDate
        print daysago

        if publishedDate < daysago:
            print True
        #if str(self.content_data['content_value']['publishedDate'])[:10] != str(datetime.datetime.now().strftime('%Y-%m-%d')):
        #if self.content_data['content_value']['publishedDate'] != (datetime.datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'):
            return None

        # check if already in db
        check = True
        if self.check == True:
            data = self.content_collection.find({'slug': self.content_data['content_value']['slug']})
            if data.count() > 0:
                check = False
        if check == True:
            content_id  = ObjectId()
            #_id         = self.content_collection.insert(self.content_data['content_value'])
            self.content_collection.update({'_id':content_id}, {"$set": self.content_data['content_value']}, upsert=True)
            #tags        = self.insert_tags(content_id)
            location    = self.insert_location(content_id)
            contact     = self.insert_contact(content_id)
            self.content_collection.update({
                '_id': content_id
            },{
                '$set': {
                    #'tags_id'      : tags,
                    'location_id'  : location,
                    'contact_id'   : contact
                }
            }, upsert = False, multi = False)

    def insert_location(self,content_id):
        location_id = ObjectId()
        self.location_data['content_id'] = content_id
        self.location_collection.update({'_id':location_id}, {"$set": self.location_data}, upsert=True)
        return location_id
        #return self.location_collection.insert(self.location_data)
    def insert_tags(self,content_id):
        tags_id     = ObjectId()
        for tag_data in self.tags_data:
            tag_data['content_id'] = content_id
        self.tag_collection.update({'_id':tags_id}, {"$set": self.tags_data}, upsert=True)
        return tags_id
        #return self.tag_collection.insert(self.tags_data)
    def insert_contact(self,content_id):
        contact_id  = ObjectId()
        self.contact_data['content_id'] = content_id
        self.contact_collection.update({'_id':contact_id}, {"$set": self.contact_data}, upsert=True)
        return contact_id
        #return self.contact_collection.insert(self.contact_data)


    # loop over links
    def crawl(self,url,decompress=None):
        print url
        req = urllib2.Request(url, headers = self.hdr)
        try:
            conn = urllib2.urlopen(req)
        except urllib2.HTTPError as e:
            print ("There was an error: %r" % e)
            self.error_handle(url,e.code)
        except urllib2.URLError as e:
            print ("There was an error: %r" % e)
            self.error_handle(url,'url error')
        except ValueError, e:
            print ("There was an error: %r" % e)
            self.error_handle(url,'unicode error')
        except:
            print ("There was an error: unkown")
            self.error_handle(url,'unknown error')
        else:
            html = conn.read()
            if decompress is not None:
                html =zlib.decompress(html, 16+zlib.MAX_WBITS)
            soup = BeautifulSoup(html, 'html.parser')
            return soup
                        

    # error handler
    def error_handle(self,url,e):
        print 'error url: ' + url
        # add to file
        with open("crawl_err_" + self.db_name +".txt", "a") as myfile:
            myfile.write(datetime.date.today().strftime('Crawling Time %d, %b %Y'))
            myfile.write('\n')
            myfile.write(url + '---' + str(e) + '\n')

