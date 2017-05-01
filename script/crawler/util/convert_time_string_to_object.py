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
#from datetime import datetime
from time import mktime
import sys


#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.get_database(sys.argv[1])
content_collection = db.contents

items = content_collection.find()

for item in items:
	print item['publishedDate']
	date_obj = datetime.datetime.strptime(str(item['publishedDate']), '%Y-%m-%d %H:%M:%S')
	date_obj = datetime.datetime(date_obj.year,date_obj.month,date_obj.day,0,0,0)

	print date_obj
	content_collection.update({'_id':item['_id']}, {"$set": {'publishedDate': date_obj, 'updatedDate':date_obj }}, upsert=False)
