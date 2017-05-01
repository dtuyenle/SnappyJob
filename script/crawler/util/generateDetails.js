var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var exec = require('child_process').exec;
var url = require('url');
var fs = require('fs');


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
var contentSchema = mongoose.Schema({

    slug            : { type: String },
    name            : { type: String, required: false, minlength: 0, maxlength: 300 },
    url             : { type: String, minlength: 0, maxlength: 3500 },
    content_type    : { type: String },
    description     : { type: String, required: true, minlength: 20, maxlength: 20000 },
    description_details: { type: String, default: '' },
    budget          : { type: String, required: false, minlength: 0, maxlength: 150 },
    crawl           : { type: Boolean },
    type			: { type: String },
    salary			: { type: String },
    location_id		: { type: Schema.Types.ObjectId, ref: 'locations' },
	contact_id		: { type: Schema.Types.ObjectId, ref: 'contacts' },
	tags_id			: [{ type: Schema.Types.ObjectId, ref: 'tags' }],
    asset_id        : { type: Schema.Types.ObjectId, ref: 'assets', default: null },
    startDate       : { type: Date, default: Date.now },
    endDate         : { type: Date, default: Date.now },
    publishedDate   : { type: Date, default: Date.now },
    updatedDate     : { type: Date, default: Date.now },

});

setTimeout(function() {
	process.exit();
}, 900000)

Content =  mongoose.model('contents', contentSchema);
var total = 0;
var check = 0;

Content
.find({"description_details": null})
.select({_id: 1, url: 1})
.exec(function(err, contents) {
	console.log(contents.length);
	total = contents.length;
	if(err) {
		console.log(err);
	}

	var urls = {};
	_.each(contents, function(content) {

		if(typeof(content.description_details) === 'undefined' || content.description_details === '' || content.description_details === null) {

			if(content.url.indexOf('http://www.careerbuilder.comhttps://www.linkedin.com/') > -1) { content.url = content.url.replace('http://www.careerbuilder.comhttps://www.linkedin.com/', 'https://www.linkedin.com/'); }
			
     		if(content.url.indexOf('www.linkedin.com') > -1) {
      	  		check = check + 1;
        		if(check === total) {
                    console.log('final');
					console.log(check);
                    process.exit();
                }
            }
            else {

            	setTimeout(function(){
					request({url:content.url, headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {
						console.log('start');
						console.log(content.url);
						console.log(content._id);
						console.log(error);

						if (!error && response.statusCode == 200) {
							console.log('https://' + response.req._headers.host + '/' + response.req.path);

							if(body.toLowerCase().indexOf('javascript disabled') > -1 || body.toLowerCase().indexOf('javascript enabled') > -1) {
								
								// bad redirect
								if(response.req._headers.host.indexOf('jobing') > -1) {
									jobing(content._id, body);
								}

								if(response.req._headers.host.indexOf('www.wyzant.com') > -1) {
									wyzantBad(content._id, body);
								}

								if(response.req._headers.host.indexOf('www.juju.com') > -1) {
									jujuBad(content._id, body);
								}
							}
							else {
								if(body.indexOf('Job Removed or Not Found') > 0) {
									removeData(content);
								}
								else {
									saveData(content._id, getData(body));
								}
							}

							
						}
						else {
							if(!error) {
								if('https://' + response.req._headers.host + '/' + response.req.path) {

									var command = 'curl ' + 'https://' + response.req._headers.host + response.req.path;
									console.log(command);
									child = exec(command, function(error, stdout, stderr){
										saveData(content._id, getData(stdout));
									});

								} else {
									console.log('Not found. Please click on apply to see job details.');
								}
							}
							if(response) {
								if(response.statusCode === 404) {
									removeData(content);
								}
								if(response.req._headers.host.indexOf('glassdoor') > -1) {
									saveData(content._id, 'Please click on apply to see job details.');
								}
							}

						}
					})
				}, 200)
			}
		} else {
			check = check + 1;
			if(check === total) {
				console.log(check);
				console.log('final');
				process.exit();
			}
		}
	})


})


function removeData(content) {

	Content.find({ _id: content._id },function(err,docs){  

		content.remove(function(err, removed) {
			check = check + 1;
			if(check === total) {
				console.log(check);
				console.log('final');
				process.exit();
			}
		});

	});  

}

function saveData(id, data) {
	Content.findById(id, function(err, content) {

		if (err) {
			console.log(err);
		}

		if(content) {
			content.description_details = data;

			content.save(function(err) {
				if (err) {
					console.log(err);
				}
				console.log({ message: 'Content updated!' });
				check = check + 1;

				if(check === total) {
					console.log('final');
					process.exit();
				}

			});
		}

	});
}

function getData(data) {
	data = data.replace('http://','https://');
	$ = cheerio.load(data);
	$('img').remove();

	if (data.indexOf('/images/indeed.png') > -1) {
		return indeed($);
	}

	if (data.indexOf('Beyond.com') > -1) {
		return beyond($);
	}

	if (data.indexOf('www.ziprecruiter.com/candidate/search') > -1 || data.indexOf('ziprecruiter.svg') > -1) {
		return ziprecruiter($);
	}

	if (data.indexOf('images/wyzant-logo-minimal-header.png') > -1) {
		return wyzant($);
	}

	if (data.indexOf('CoolWorks.com') > -1) {
		return coolworks($);
	}

	if (data.indexOf('care-logo-nav') > -1) {
		return care($);
	}

	if (data.indexOf('http://www.careerbuilder.com/') > -1) {
		return careerbuilder($);
	}

	if (data.indexOf('Professional Diversity Network') > -1) {
		return prodivnet($);
	}

	if (data.indexOf('usajobs-nav__brand') > -1) {
		return usajob($);
	}

	if (data.indexOf('idealist-logo') > -1) {
		return idealist($);
	}

	if (data.indexOf('Sittercity.com') > -1) {
		return sittercity($);
	}

	if (data.indexOf('nwlc.org') > -1) {
		return nwlc($);
	}

	if (data.indexOf('JobsRadar.com') > -1) {
		return jobsradar($);
	}

	if (data.indexOf('Snagajob') > -1) {
		return snagajob($);
	}

	if (data.indexOf('mothership-strategies') > -1) {
		return mothership_strategies($);
	}

	if(data.indexOf('iHireBroadcasting') > -1) {
		return ihirebroadcasting($);
	}
	

	return '';
}


function indeed($) {
	$('#indeed_apply').remove();
	$('.result-link-bar-container').remove();
	$('.recJobs').remove();
	var content = $('#job-content');
	return content.html();
}

function beyond($) {
	return $('.featured-job-description').html();
}

function jobing(id, body) {
	body = body.replace('http://','https://');
	$ = cheerio.load(body);
	var url = $('a').attr('href');
	request({url:decodeURI(url), headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {
		if (error) {
			return console.error('upload failed:', error);
		}
		$ = cheerio.load(body);
		saveData(id, $('div[itemprop="description"]').html())
	});
}

function ziprecruiter($) {
	return $('div[itemprop="description"]').html();
}

function wyzant($) {
	return $('.box-gray').html();
}

function wyzantBad(id, body) {
	body = body.replace('http://','https://');
	$ = cheerio.load(body);
	var url = $('a').attr('href');
	request({url:decodeURI(url), headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {
		if (error) {
			return console.error('upload failed:', error);
		}
		$ = cheerio.load(body);
		saveData(id, $('.box-blue').html())
	});
}

function prodivnet($) {
	return $('.job-body').html();
}

function usajob($) {
	return $('.usajobs-content-well').html();
}

function coolworks($) {
	return $('div[itemprop="description"]').html();
}

function care($) {
	return $('.profile-view').html();
}

function careerbuilder($) {
	return $('#job-description-section').html();
}

function juju($) {
	return $('.box-blue').html();
}

function jujuBad(id, body) {
	body = body.replace('http://','https://');
	$ = cheerio.load(body);
	var url = $('a').attr('href');
	request({url:decodeURI(url), headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}}, function (error, response, body) {
		if (error) {
			return console.error('upload failed:', error);
		}
		$ = cheerio.load(body);
		if(body.indexOf('iHireBroadcasting') > -1) {
			saveData(id, ihirebroadcasting($))
		}
		if(body.indexOf('Snagajob') > -1) {
			saveData(id, snagajob($))
		}
	});
}

function ihirebroadcasting($) {
	return  $('.well-transparent').html()
}

function idealist($) {
	return $('.listing-overview-description').html();
}

function sittercity($) {
	return $('.job-description').html();
}

function nwlc($) {
	return $('.entry-content').html();
}

function jobsradar($) {
	return $('.modalShortDesc').html();
}

function snagajob($) {
	return $('.job-description').html();
}

function mothership_strategies($) {
	var data = '';
	$('.section--text').each(function(key, item) {
		data = data + $(item).html();
	});
	return data;
}



