from pymongo import MongoClient
from bson.code import Code
import sys

#mongo connection
client = MongoClient('localhost',27017)

#fields
db 					= client.get_database(sys.argv[1])
location_collection = db.locations

locations = location_collection.find({'content_id':None})

for location in locations:
	print location


