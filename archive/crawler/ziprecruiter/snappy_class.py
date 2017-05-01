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


class SnappyContent:

    def __init__(self,db_name):

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
        self.db = client[db_name]
        self.content_collection  = db.contents
        self.location_collection = db.locations
        self.tag_collection      = db.tags
        self.contact_collection  = db.contacts

        content_collection.drop()
        tag_collection.drop()
        location_collection.drop()
        contact_collection.drop()

    def loadContent(content):
        self.content_data = content
    def loadLocation(location):
        self.location_data = location
    def loadTags(tags):
        self.tags_data = tags
    def loadContact(contact):
        self.contact_data = contact

    def insert_content:

        if self.content_data is None:
            return None

        # check if already in db
        check = content_collection.find({'slug': content_data['content_value']['slug']})
        if check.count() == 0:
            _id         = content_collection.insert(content_data['content_value'])
            tags        = insert_tags()
            location    = insert_location()
            contact     = insert_contacts()
            content_collection.update({
                '_id': _id
            },{
                '$set': {
                    'tags_id'      : tags,
                    'location_id'  : location,
                    'contact_id'   : contact
                }
            }, upsert=False, multi=False)

    def insert_location(content_id):
        self.location_data.content_id = content_id
        return self.location_collection.insert(self.location_data)
    def insert_tags(content_id):
        return self.tag_collection.insert(self.tags_data)
    def insert_contact(content_id):
        return self.contact_collection.insert(self.contact_data)


    # loop over links
    def crawl(url):
        req = urllib2.Request(url, headers=self.hdr)
        try:
            conn = urllib2.urlopen(req)
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
            html = conn.read()
            soup = BeautifulSoup(html)
            return soup
                        

    # error handler
    def error_handle(url,e):
        print 'error url: ' + url
        # add to file
        with open("crawl_err.txt", "a") as myfile:
            myfile.write(url + '---' + str(e) + '\n')

