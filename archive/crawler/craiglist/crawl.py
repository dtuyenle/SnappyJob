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

#header
#AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11
hdr = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)',
       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
       'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
       'Accept-Encoding': 'none',
       'Accept-Language': 'en-US,en;q=0.8',
       'Connection': 'keep-alive'}

#mongo connection
client = MongoClient('localhost',27017)

#fields
db = client.closeby
content_collection = db.contents
location_collection = db.locations
tag_collection = db.tags
contact_collection = db.contacts


content_collection.drop()
tag_collection.drop()
location_collection.drop()
contact_collection.drop()


#insert contacts
def insert_contacts(collection,content_id,domain,url,hdr):
    contacts_value = get_contacts(content_id,domain,url,hdr)
    return collection.insert(contacts_value)
# grab contacts
def get_contacts(content_id,domain,url,hdr):
    url = url.replace(domain, domain + '/reply').replace('.html','')
    print 'contact: ' + url
    soap_object = crawl(url,hdr)
    email = ''
    if soap_object is not None:
        if soap_object.find("a",{ "class" : "mailapp" }) is not None:
            email = html2text.html2text(soap_object.find("a",{ "class" : "mailapp" }).getText()).replace('\n','')
    return {
        'content_id': content_id,
        'email': email,
        'phone':''
    }

#insert location
def insert_location(collection,content_id,state,city,soap_object):
    location_value = get_location(content_id,state,city,soap_object)
    return collection.insert(location_value)
# grab location
def get_location(content_id,state,city,soap_object):
    location = soap_object.find("div",{ "id" : "map" })
    lat_value = ''
    long_value = ''
    if location is not None:
        if location.get('data-latitude',None) is not None:
            lat_value = location.get('data-latitude',None)
            print lat_value
            if lat_value is not None:
                lat_value = float(lat_value)
        if location.get('data-longitude',None) is not None:
            long_value = location.get('data-longitude',None)
            print long_value
            if long_value is not None:
                long_value = float(long_value) 
    location_value = {
        'content_id': content_id,
        'address': '',
        'city': city,
        'state': state,
        'zip': '',
        'loc': {
            'lon': long_value,
            'lat': lat_value
        }
    }
    return location_value


#insert tags
def insert_tags(collection,content_id,soap_object):
    tags_value = get_tags(content_id,soap_object)
    tags_array = []
    for tag_value in tags_value:
        id = collection.insert(tag_value)
        tags_array.append(id)
    return tags_array
# grab tags
def get_tags(content_id,soap_object):
    return_tags = []
    tags_value = soap_object.find("p",{ "class" : "attrgroup" })
    for tag_value in tags_value.findAll('span'):
        tag = tag_value.getText()
        return_tags.append({
                'content_id': content_id,
                'tag': tag
            })
    return return_tags



# insert content
def insert_content(collection,content_type,url,domain,state,city,hdr):
    content_obj = get_content(url,content_type,hdr)
    _id         = collection.insert(content_obj['content_value'])
    tags        = insert_tags(tag_collection,_id,content_obj['soap_object'])
    location    = insert_location(location_collection,_id,state,city,content_obj['soap_object'])
    contact     = insert_contacts(contact_collection,_id,domain,url,hdr)
    collection.update({
        '_id': _id
    },{
        '$set': {
            'tags_id'      : tags,
            'location_id'  : location,
            'contact_id'   : contact
        }
    }, upsert=False, multi=False)
# grab content
def get_content(url,content_type,hdr):

    soap_object = crawl(url,hdr)

    # name
    name = html2text.html2text(soap_object.find("h2", { "class" : "postingtitle" }).getText()).replace('\n',' ')
    #slug
    slug = slugify(name)
    # description
    description = str(soap_object.find("section", { "id" : "postingbody" })).replace('\n',' ')
    # budget
    budget = html2text.html2text(soap_object.find('div', {"class": "bigattr"}).getText()).replace('\n',' ')
    # date
    dates = soap_object.find_all('time')
    # published date
    published_date = dates[0].get('datetime',None)
    # updated data
    updated_date = dates[1].get('datetime',None)

    content_value = {
        'name': name,
        'url': url,
        'slug': slug,
        'content_type': content_type,
        'description': description,
        'budget': budget,
        'publishedDate': published_date,
        'updatedDate': updated_date,
        'crawl' : True
    }

    return { 'content_value': content_value, 'soap_object': soap_object }


# grab all links
def get_links(url,domain_name,hdr):
    links = []
    domain = ""
    soap_object = crawl(url,hdr)

    domain_snippets = soap_object.findAll("select", { "id" : "areaAbb" })
    for domain_snippet in domain_snippets:
        domain = domain_snippet.findAll('option')[0]
        domain = domain.get('value',None)

    url_snippets = soap_object.findAll("span", { "class" : "pl" })
    for url_snippet in url_snippets:
        urls = url_snippet.findAll('a')
        for url in urls:
            link = url.get('href',None)
            if 'http' in link:
                links.append(link)
            else:
                print domain_name
                links.append(domain_name + link)
    return links




# loop over links
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
        myfile.write(url + '---' + str(e) + '\n')


def build_sites(domain,query):
    sites = []
    sites.append(domain + '/search/jjj?is_parttime=1&query=' + query)
    sites.append(domain + '/search/jjj?s=100&is_parttime=1&query=' + query)
    return sites

# spin up bunch of threads
q = Queue.Queue()

# site to crawl
queries = ['pet']
#'babysit','house%20cleaning']

def put_get_content(q,content,content_type,link,domain,state,city,hdr):
    q.put(insert_content(content,content_type,link,domain,state,city,hdr))

# get url
with open('state.json') as data_file:    
    data = json.load(data_file)

# start
limit = 1
for state in data:
    for city in data[state]:

        # check if reach limit how many cities to crawl
        limit = limit + 1
        if limit > 2:
            raise SystemExit

        for query in queries:

            for site in build_sites(data[state][city],query):
                links = get_links(site,data[state][city],hdr)

                for link in links:
                    print 'current url: ' + link
                    #insert_content(content_collection,'craiglist - ' + query,link,data[state][city],state,city,hdr)

                    t = threading.Thread(target=put_get_content, args = (q,content_collection,'craiglist - ' + query,link,data[state][city],state,city,hdr))
                    t.daemon = True
                    t.start()

s = q.get()
print s





