import pymongo
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from multiprocessing import Pool

import urllib, json

# get list of source_id from mongo
url = "http://localhost:8020/api/encyclopedia/all"
response = urllib.urlopen(url);
urls = json.loads(response.read())
print urls
# open file
text_file = open("cms2_adam_src_id_to_url_mapping.txt", "r")
lines = text_file.readlines()


def process_line(line):
	line = line.split('\t')
	new_string = ''
	not_found = ''
	print line[0]
	if line[0] in urls['data'] and str(line[0]) != '16890':
		#and str(line[0]) != '13079' and str(line[0]) != '13080' and str(line[0]) != '2068':
		print urls['data'][line[0]]
		new_string =  line[0] + '\t' + line[1].replace('\n','') + '\t' + str(urls['data'][line[0]]) + '\n'
		with open("soure_id.txt", "a") as myfile:
			myfile.write(new_string)
	else:
		not_found =  line[0] + '\t' + line[1]
		new_string =  line[0] + '\t' + line[1]
		with open("soure_id.txt", "a") as myfile:
			myfile.write(new_string)
		with open("not_found.txt", "a") as myfile:
			myfile.write(not_found)


			


if __name__ == '__main__':
    pool = Pool(processes=4)              # process per core
    pool.map(process_line, lines)



