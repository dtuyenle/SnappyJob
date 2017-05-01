/*
#https://webhose.io/search?token=9aadfa87-3abd-4047-a6a3-0559f4f5d961&format=json&q=(student%20job%20OR%20student%20career%20OR%20part%20time%20job)%20-India%20thread.title%3A(job)%20thread.section_title%3A(news)%20language%3A(english)%20thread.country%3AUS%20(site_type%3Anews)&ts=1463534387297

import urllib2
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
/*from HTMLParser import HTMLParser
import urlparse
import re
import datetime
from datetime import timedelta
import zlib
import sys
from datetime import date, timedelta
import random
import urllib
import requests


values = urllib.urlencode({
	"token":"9aadfa87-3abd-4047-a6a3-0559f4f5d961",
	"format":"json",
	"q":"(student job OR student career OR part time job) -India thread.title:(job) thread.section_title:(news) language:(english) thread.country:US (site_type:news)",
	"ts": "1463534387297"
})

headers = {
	'Accept'	: 'text/plain',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language' :	'en-US,en;q=0.5',
	'Content-Length':	'114',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:38.0) Gecko/20100101 Firefox/38.0',
}


cafile = 'cacert.pem'
resp = requests.get("https://webhose.io/search", data=values, headers=headers, allow_redirects=True)
print i
print resp.text	
print resp.status_code
*/

var url = 'https://webhose.io/search?token=9aadfa87-3abd-4047-a6a3-0559f4f5d961&format=json&q=(student%20job%20OR%20student%20career%20OR%20part%20time%20job)%20-India%20thread.title%3A(job)%20thread.section_title%3A(news)%20language%3A(english)%20thread.country%3AUS%20(site_type%3Anews)&ts=1463534387297';
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var exec = require('child_process').exec;
var fs = require('fs');
var _ = require('underscore');


// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/snappyjob', function (error) {
    if (error) {
        console.log(error);
    }
});
var Schema   = mongoose.Schema;

// Mongoose Schema definition
var newsSchema = mongoose.Schema({
	uid: {type: String },
    url : { type: String },
    main_image: { type: String },
    title : { type: String, required: false, minlength: 0, maxlength: 3000 },
   	text : { type: String, required: false, minlength: 0, maxlength: 300000 },
    published : { type: Date, default: Date.now },

});

News =  mongoose.model('news', newsSchema);


console.log(url);
request({url:url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {

	console.log(error);
	var body = JSON.parse(body);
	var total = body.posts.length;
	var count = 1;
	for(var i = 0, length = body.posts.length; i < length; i++) {

		var news = new News();

		news.uid = body.posts[i].uuid;
		news.url = body.posts[i].url;
		news.main_image	= body.posts[i].thread.main_image;
		news.title = body.posts[i].title;
		news.text = body.posts[i].text;
		news.published = body.posts[i].published;

		news.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log({ message: 'News created!' });
			}
			count = count + 1;
			if(count == total) {
				process.exit();
			}
		});


	}

})

