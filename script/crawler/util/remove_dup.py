'''from pymongo import MongoClient
from bson.code import Code

client = MongoClient()
db = client["snappyjob"]

col = db["contents"]

map = Code("function(){ if(this.description){emit(this.description,1);}}")
reduce = Code("function(key,values) {"
	"return Array.sum(values);"
"}")

res = col.map_reduce(map,reduce,"my_results");


response = []
for doc in res.find():
	if(doc['value'] > 1):
		count = int(doc['value']) - 1
		docs = col.find({"description":doc['_id']},{'_id':1}).limit(count)
		for i in docs:
			response.append(i['_id'])



col.remove({"_id": {"$in": response}})'''
'''
-> get all contents
-> find with id
-> if true remove
'''

from pymongo import MongoClient
from bson.code import Code
import datetime
from datetime import date
from datetime import timedelta

import sys
import re

#mongo connection
client = MongoClient('localhost',27017)

#fields
db 					= client.get_database(sys.argv[1])
location_collection = db.locations
content_collection 	= db.contents
news_collection = db.news
tips_collection = db.tips

check = 1

contents = content_collection.find()
news = news_collection.find()
tips = tips_collection.find()

from urlparse import urlparse


def remove_query(url):
	o = urlparse(url)
	url_without_query_string = o.scheme + "://" + o.netloc + o.path
	return url_without_query_string


def remove(content_id,location_id):
	content_collection.remove({"_id":content_id})
	location_collection.remove({"_id":location_id})

def deleteDup(contents):
	i = 0
	for content in contents:
		if i > 0:
			remove(content["_id"], content["location_id"])
		i = i + 1

for content in contents:
	content["url_no_query"] = remove_query(content["url"])
	if content["description"] is not None:
		contents_dup = content_collection.find({ "description": content["description"] })
		if contents_dup.count() > 1:
			print contents_dup.count()
			deleteDup(contents_dup)
	content_collection.update({'_id':content["_id"]}, {"$set": content}, upsert=False)

contents = content_collection.find()
for content in contents:
	if content["name"] is not None:
		contents_dup = content_collection.find({ "name": content["name"], "url_no_query": content["url_no_query"] })
		if contents_dup.count() > 1:
			print contents_dup.count()
			deleteDup(contents_dup)


'''
for content in contents:
	contents_dups = content_collection.find({"name": content["name"]})
	print contents_dups.count()
	if contents_dups.count() > 1:
		list_ = []
		for content_dup in contents_dups:
			for location_ in location_collection.find( {"_id": content_dup["location_id"]} ):
				content_dup['location'] = location_
				list_.append(content_dup)
		for item in list_:
			for item_loop in list_:
				if item
				item['state']
				item['city']
		exit()
'''




'''
news
'''

def removeNews(id):
	news_collection.remove({"_id":id})

def deleteDupNews(news):
	i = 0
	for new in news:
		if i > 0:
			removeNews(new["_id"])
		i = i + 1

for new in news:
	news_dup = news_collection.find({"url": new["url"]})
	if news_dup.count() > 1:
		print news_dup.count()
		deleteDupNews(news_dup)


'''
tips
'''

def removeTips(id):
	tips_collection.remove({"_id":id})

def deleteDupTips(tips):
	i = 0
	for tip in tips:
		if i > 0:
			removeTips(tip["_id"])
		i = i + 1

for tip in tips:
	tips_dup = tips_collection.find({"img": tip["img"]})
	if tips_dup.count() > 1:
		print tips_dup.count()
		deleteDupTips(tips_dup)

