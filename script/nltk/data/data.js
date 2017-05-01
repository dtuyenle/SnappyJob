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
    type: { type: String }
});

var Nltk =  mongoose.model('nltk', nltkSchema);


//var url = 'http://www.snagajob.com/find-jobs-by-job-title?j=';
//var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];


var urls = ["http://www.snagajob.com/job-search/q-accounting-finance-jobs", "http://www.snagajob.com/job-search/q-analyst", "http://www.snagajob.com/job-search/q-banker", "http://www.snagajob.com/job-search/q-teller", "http://www.snagajob.com/job-search/q-automotive-jobs", "http://www.snagajob.com/job-search/q-assistant+manager", "http://www.snagajob.com/job-search/q-service+technician", "http://www.snagajob.com/job-search/q-lube+technician", "http://www.snagajob.com/job-search/q-construction-jobs", "http://www.snagajob.com/job-search/q-electrician", "http://www.snagajob.com/job-search/q-landscaping", "http://www.snagajob.com/job-search/q-plumber", "http://www.snagajob.com/job-search/q-customer-service-jobs", "http://www.snagajob.com/job-search/q-cashier", "http://www.snagajob.com/job-search/q-representative", "http://www.snagajob.com/job-search/q-merchandiser", "http://www.snagajob.com/job-search/q-education-jobs", "http://www.snagajob.com/job-search/q-classroom+instructor", "http://www.snagajob.com/job-search/q-driver", "http://www.snagajob.com/job-search/q-teaching+assistant", "http://www.snagajob.com/job-search/q-salon-spa-fitness-jobs", "http://www.snagajob.com/job-search/q-cosmetologist", "http://www.snagajob.com/job-search/q-hair+stylist", "http://www.snagajob.com/job-search/q-manicurists", "http://www.snagajob.com/job-search/q-healthcare-jobs", "http://www.snagajob.com/job-search/q-caregiver", "http://www.snagajob.com/job-search/q-certified+nursing+assistant", "http://www.snagajob.com/job-search/q-nurse", "http://www.snagajob.com/job-search/q-hotel-hospitality-jobs", "http://www.snagajob.com/job-search/q-attendant", "http://www.snagajob.com/job-search/q-housekeeper", "http://www.snagajob.com/job-search/q-service+worker", "http://www.snagajob.com/job-search/q-food-restaurant-jobs", "http://www.snagajob.com/job-search/q-casual+dining", "http://www.snagajob.com/job-search/q-coffee+shops", "http://www.snagajob.com/job-search/q-fast+food", "http://www.snagajob.com/job-search/q-pizza+restaurants", "http://www.snagajob.com/job-search/q-retail-jobs", "http://www.snagajob.com/job-search/q-apparel", "http://www.snagajob.com/job-search/q-convenience+stores", "http://www.snagajob.com/job-search/q-department+stores", "http://www.snagajob.com/job-search/q-specialty+retail", "http://www.snagajob.com/job-search/q-sales-marketing-jobs", "http://www.snagajob.com/job-search/q-merchandiser", "http://www.snagajob.com/job-search/q-associate", "http://www.snagajob.com/job-search/q-telemarketer"];
var pagination = '/page-2';

new_urls = [];
for(var i = 0, length = urls.length; i < length; i++) {
	for(var j = 0; j < 51; j++) {
		new_urls.push(urls[i] + '/page-' + j);
	}
}


var total = new_urls.length * 16;
var count = 0;

for(var i = 0, length = new_urls.length; i < length; i++) {

	
	(function() {

		var url = new_urls[i];
		var type = url.split('/')[4].replace('q-','').replace('-', ' ');

		
		request({url:url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {
			if(body) {
				var $ = cheerio.load(body);

				$('h2.result-title').each(function(){ 

					var nltk = new Nltk();
					nltk.name = type.replace('jobs',' ').replace('+',' ').trim() + ' ' + $(this).text().trim().replace(/\n/g,'');
					nltk.type = type.replace('jobs',' ').replace('+',' ').trim();
					console.log(type);


					nltk.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log({ message: 'Nltk created!' });
						}
						console.log(count);
						console.log(total);
						count++;
					});


				})
			}

		})
	})()

}

