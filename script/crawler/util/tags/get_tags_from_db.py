import urllib2
import pymongo
import uuid
import html2text
from bson.objectid import ObjectId
from pymongo import MongoClient
from bs4 import BeautifulSoup
from slugify import slugify

import Queue
import threading


from HTMLParser import HTMLParser

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

#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.closeby
content_collection = db.contents


items = content_collection.find({},{'description': 1})

for item in items:
    with open("tags.txt", "a") as myfile:
        if item['description'] is not None:
            myfile.write(strip_tags(item['description'].encode('utf8')) + '\n')


