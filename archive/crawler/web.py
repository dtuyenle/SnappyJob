from flask import Flask, url_for, render_template
from flask import Response
from flask import request
from flask import Markup
app = Flask(__name__)

import pymongo
from pymongo import MongoClient
from bson.json_util import dumps

#mongo connection
client = MongoClient('localhost',27017)
db = client.links
collection = db.url

@app.route('/', methods = ['GET','POST'])
def api_root():
    return render_template('output.html')

@app.route('/urls', methods = ['GET'])
def api_urls():
	urls = collection.find()
	js = dumps({'content': urls, 'length': urls.count()})
	resp = Response(js, status=200, mimetype='application/json')
	return resp

@app.route('/urls/get', methods = ['GET'])
def api_url():
    if 'url' in request.args:
    	new_urls = []
    	urls = collection.find({'from':request.args['url']})
    	for url in urls:
    		obj = {
    			'name' : url['url'].replace('http://www.healthcentral.com',''),
    			'status_code': url['status_code']
    		}
    		items = collection.find({'from':url['url']})
    		new_items = []
    		for item in items:
    			new_items.append({
					'name' : item['url'].replace('http://www.healthcentral.com',''),
	    			'status_code': item['status_code']
    			})
    		obj['children'] = new_items
    		new_urls.append(obj) 


    	js = dumps({'content': new_urls})
    	resp = Response(js, status=200, mimetype='application/json')
    	return resp
    else:
        return 'Hello'

@app.route('/urls/error', methods = ['GET'])
def api_error():
    if 'code' in request.args:
    	print request.args['code']
    	urls = collection.find({'status_code':int(request.args['code'])})
    	js = dumps({'content': urls})
    	resp = Response(js, status=200, mimetype='application/json')
    	return resp
    else:
        return 'Hello'


if __name__ == '__main__':
    app.run()
