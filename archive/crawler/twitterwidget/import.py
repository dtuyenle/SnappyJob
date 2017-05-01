import pymongo
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from multiprocessing import Pool

#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.snappyjob
twitter_collection = db.twitters
twitter_collection.drop()


text_file 	= open("widget_id.txt", "r")
lines 		= text_file.readlines()

for line in lines:
	item = line.split(',')
	print item
	twitter_collection.insert({
		'twitter_id': item[2].replace('\n',''),
		'state':item[1],
		'state_name':item[0]
	})