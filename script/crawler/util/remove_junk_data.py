from pymongo import MongoClient
from bson.code import Code
import datetime
from datetime import date
from datetime import timedelta

import sys
import re
from bson.objectid import ObjectId


# list
list_ = [re.compile(r'Senior Program Specialist (Senior Advisor)', re.IGNORECASE)]
ids = [ObjectId("5743251c8b2d564f1f525ecd")]

#mongo connection
client = MongoClient('localhost',27017)

#fields
db                                      = client.get_database(sys.argv[1])
location_collection = db.locations
content_collection      = db.contents


def remove(content_id,location_id):
        content_collection.remove({"_id":content_id})
        location_collection.remove({"_id":location_id})


for item in list_:
        for content in  content_collection.find({ "name": { '$regex': item } }):
                print content
                remove(content["_id"], content["location_id"])

for id_ in ids:
        print id_
        for content in  content_collection.find({ "_id": id_ }):
                print content
                remove(content["_id"], content["location_id"])

