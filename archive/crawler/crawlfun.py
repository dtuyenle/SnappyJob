import urllib2
import pymongo
from pymongo import MongoClient
from bs4 import BeautifulSoup

#header
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}


#site to crawl
site = 'http://www.healthcentral.com'

#mongo connection
client = MongoClient('localhost',27017)
db = client.links
collection = db.url



# loop over links
def crawl(current_curl,from_url):
    req = urllib2.Request(current_curl, headers=hdr)
    
    try:
        conn = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        print ("There was an error: %r" % e)
        error_handle(current_curl,from_url,e.code)
    except urllib2.URLError as e:
        print ("There was an error: %r" % e)
        error_handle(current_curl,from_url,'url error')
    except ValueError, e:
        print ("There was an error: %r" % e)
        error_handle(current_curl,from_url,'unicode error')
    except:
        print ("There was an error: unkown")
        error_handle(current_curl,from_url,'unknown error')
    else:
        html = conn.read()
        soup = BeautifulSoup(html)
        links = soup.find_all('a')
        for tag in links:
            link = tag.get('href',None)
            if link is not None:

                # add domain name
                if not 'http' in link or link.index("http") > 0 :
                    link = 'http://www.healthcentral.com' + link
                
                # print link
                print 'current: ' + link
                print 'from: ' + from_url

                # if no duplicate result
                dup = collection.find({'url':link})
                print dup.count()

                # continue if duplicate
                if dup.count() > 0:
                    continue
                else:
                    if 'healthcentral' in link:
                        print 'add'
                        # add to db
                        url = {'url':link,'status_code':200,'from': from_url}
                        collection.insert_one(url)

                        # crawl the site
                        crawl(link,current_curl)
                    


# error handler
def error_handle(current_curl,from_url,e):
    print 'current: ' + current_curl
    print 'from: ' + from_url
    # add to db
    url = {'url':current_curl,'status_code':e, 'from':from_url}
    collection.insert_one(url)


# first crawl
crawl(site,'')
