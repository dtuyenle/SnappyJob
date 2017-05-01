from pymongo import MongoClient
from bson.code import Code
import datetime
from datetime import date
from datetime import timedelta

import sys

#mongo connection
client = MongoClient('localhost',27017)

#fields
db 					= client.get_database(sys.argv[1])
location_collection = db.locations
content_collection 	= db.contents

check = 1

locations = location_collection.find()


def remove(content_id,location_id):
	content_collection.remove({"_id":content_id})
	location_collection.remove({"_id":location_id})



for location in locations:
	
	updatedDate = datetime.datetime.strptime(str(location['updatedDate']), "%Y-%m-%d %H:%M:%S")
	date_obj = datetime.datetime.today() - timedelta(days=15)
	
	if datetime.datetime.today() > updatedDate:
		if updatedDate > date_obj:
			print 'good'
			print datetime.datetime.today() 
			print updatedDate
			print date_obj
		else:
			print 'bad'
			print location
			print datetime.datetime.today() 
			print updatedDate
			print date_obj
			remove(location['content_id'],location['_id'])
	else:
		print 'bad'
		print location
		print datetime.datetime.today() 
		print updatedDate
		print date_obj
		remove(location['content_id'],location['_id'])

