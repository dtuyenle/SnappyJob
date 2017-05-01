from optparse import OptionParser
import os.path
import re
import urllib2
import pymongo
import uuid
import html2text
from bson.objectid import ObjectId
from pymongo import MongoClient
from bs4 import BeautifulSoup
from slugify import slugify
from multiprocessing import Pool
import smtplib

import Queue
import threading

#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.closeby
email_collection = db.crawler_email

#header
#AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}


email_regex = re.compile(("([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`"
                    "{|}~-]+)*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(\.|"
                    "\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"))


def get_emails(s):
	s.lower()
	values = []
	emails = re.findall(email_regex, s)
	for email in emails:
		if not email[0].startswith('//'):
			values.append(email[0])
	return values


def crawl(url,hdr):
    req = urllib2.Request(url, headers=hdr)
    try:
        conn = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        print ("There was an error: %r" % e)
        error_handle(url,e.code)
    except urllib2.URLError as e:
        print ("There was an error: %r" % e)
        error_handle(url,'url error')
    except ValueError, e:
        print ("There was an error: %r" % e)
        error_handle(url,'unicode error')
    except:
        print ("There was an error: unkown")
        error_handle(url,'unknown error')
    else:
        html = conn.read()
        soup = BeautifulSoup(html)
        return soup
                    

# error handler
def error_handle(url,e):
    print 'error url: ' + url
    # add to file
    with open("crawl_err.txt", "a") as myfile:
        myfile.write(url + '---' + e)



def process_line(line):
	data = html2text.html2text(crawl(line.replace('\n',''),hdr).find('body').getText()).replace('\n','')
	emails  = get_emails(data)
	for email in emails:
		print email
		email_collection.insert({'email':email})




def send_email(email_list):
	gmail_user = "user@gmail.com"
	gmail_pwd = "secret"
	FROM = 'user@gmail.com'
	TO = email_list #must be a list
	SUBJECT = "Testing sending using gmail"
	TEXT = "Testing sending mail using gmail servers"

	# Prepare actual message
	message = 'this is a test'
	try:
	    #server = smtplib.SMTP(SERVER) 
	    server = smtplib.SMTP("smtp.gmail.com", 587) #or port 465 doesn't seem to work!
	    server.ehlo()
	    server.starttls()
	    server.login(gmail_user, gmail_pwd)
	    server.sendmail(FROM, TO, message)
	    #server.quit()
	    server.close()
	    print 'successfully sent the mail'
	except:
	    print "failed to send mail"




#open file
text_file = open("urls.txt", "r")
lines = text_file.readlines()
pool = Pool(processes=4)              # process per core
pool.map(process_line, lines)


send_email(['',''])


