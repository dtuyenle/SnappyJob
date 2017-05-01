from pymongo import MongoClient
from bson.code import Code
import sys

#mongo connection
client = MongoClient('localhost',27017)

#fields
db 					= client.get_database(sys.argv[1])
location_collection = db.locations
content_collection 	= db.contents

check = 1

locations = location_collection.find()

for location in locations:
	if 'content_id' not in location:
		check = check + 1
		continue
	content = content_collection.find({'_id':location['content_id']})
	for item in content:
		print location['_id']
		print item['updatedDate']
		location_collection.update({'_id':location['_id']}, {"$set": {'updatedDate': item['updatedDate']}}, upsert=False)


print check
