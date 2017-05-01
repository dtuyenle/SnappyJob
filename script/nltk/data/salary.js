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
var nltkSchema = mongoose.Schema({
    name : { type: String },
    type: { type: String },
    salary: { type: String }
});

var Nltk =  mongoose.model('nltk', nltkSchema);

/*
var url = 'http://www.payscale.com/index/US/Job/';
var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var urls = [];

for(var i = 0, length = arr.length; i < length; i++) {
	urls.push(url + arr[i].toUpperCase());
}


var total = urls.length;
var count = 0;

for(var i = 0, length = urls.length; i < length; i++) {

	
	(function() {

		var url = urls[i];
		
		request({url:url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {
			if(body) {
				var $ = cheerio.load(body);

				$('.table a').each(function(index, item) {
					var title = $(item).text();
					var href = $(item).attr('href');
					console.log(title + ' - ' + href);
					fs = require('fs');
					var contents = fs.readFileSync('job_title.txt','utf8').toString();
				  	fs.writeFileSync('job_title.txt', contents + '\n' + title + ' ++++ ' + href, 'utf8');
				})
			}

			count++;
			if(total === count) {
				process.exit();
			}

		})
	})()


}
*/

/*

fs = require('fs');
var data = fs.readFileSync('job_title.txt','utf8').toString();
var contents = data.split('\n');
var url_ = 'http://www.payscale.com';
var titles = [];
var urls = [];
for (content of contents) {
	urls.push(url_ + content.split('++++')[1].replace(' ', ''));
	titles.push(content.split('++++')[0]);
}

var total = urls.length;
var count = 0;

var batch = 0;
setInterval(function(){
	
	console.log('batch', batch);
	for(var i = batch, length = batch + 3; i < length; i++) {

		(function() {
			var url = urls[i];
			var title = titles[i];

			request({ url:url, headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36' }}, function (error, response, body) {
				if(body) {

					var $ = cheerio.load(body);
					var dollars = [];
					$('.hourly .ticker').each(function(index, item) {
						var dollar = $(item).text();
						dollars.push(dollar.trim());
					});

					console.log('url', url);
					console.log('result', title + ' ++++ ' + dollars.join('__'));

*/

					/*var nltk = new Nltk();
					nltk.name = title;
					nltk.type = '';
					nltk.salary = dollars.join('__');


					nltk.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log({ message: 'Nltk created!' });
						}
						
						count++;
						if(total === count) {
							process.exit();
						}
					});*/


					/*fs = require('fs');
					var contents = fs.readFileSync('job_salary.txt','utf8').toString();
			  		fs.writeFileSync('job_salary.txt', contents + '\n' + title + ' ++++ ' + dollars.join('__'), 'utf8');
				}


			})


		})()
	}

	batch = batch + 3;

}, 4000)*/

/*
fs = require('fs');
var contents = fs.readFileSync('job_salary.txt','utf8').toString();

for(content of contents.split('\n')) {
	var data = content.split('++++');
	if(data[1] !== ' ') {
		var title = data[0];
		var sal_str = '';
		var sal_obj = {};
		var salarys = data[1].replace(' (Median)____','').split('__');
		for(salary of salarys) {
			if(salary.indexOf('$') > -1) {
				sal_obj[salary] = 1;
			}
		}
		for(var prop in sal_obj) {
			if(sal_str === '') {
				sal_str = prop;
			} else {
				sal_str = sal_str + ' - ' + prop;
			}
		}
		console.log(title);
		console.log(sal_str);
		var contents = fs.readFileSync('salary.txt','utf8').toString();
  		fs.writeFileSync('salary.txt', contents + '\n' + title + ' ++++ ' + sal_str, 'utf8');
	}

}
*/


/*
fs = require('fs');
var contents = fs.readFileSync('salary.txt','utf8').toString().split('\n');

for(var i = 0, length = contents.length; i < length; i++) {
	
	(function(){
		var data = contents[i].split('++++');
		var title = data[0].trim();
		var salary = data[1].trim();

		var nltk = new Nltk();
		nltk.name = title;
		nltk.type = '';
		nltk.salary = salary;


		nltk.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log({ message: 'Nltk created!' });
			}
		});
	})()

}
*/



fs = require('fs');
var contents = fs.readFileSync('federal_job.txt','utf8').toString().split('\n');

for(var i = 0, length = contents.length; i < length; i++) {

	(function(){
		var data = contents[i].split(',');
		var title = data[0].trim();
		var salary = data[1].trim();

		var nltk = new Nltk();
		nltk.name = title;
		nltk.type = '';
		nltk.salary = salary;


		nltk.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log({ message: 'Nltk created!' });
			}
		});
	})()

}




