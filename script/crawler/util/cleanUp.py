from pymongo import MongoClient
from bson.code import Code
import datetime
from datetime import date
from datetime import timedelta

import sys
import re
from bson.objectid import ObjectId
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
db = client.get_database(sys.argv[1])
content_collection = db.contents


for content in  content_collection.find():
    print content
    new_name = strip_tags(content['name'].replace('\n',''))
    content_collection.update({
	  '_id': content['_id']
	},{
		'$set': {
			'name': new_name 
		}
	}, upsert=False)


