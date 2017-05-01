var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var exec = require('child_process').exec;


module.exports = function(app, passport) {

	app.route('/iframe')

		.get(function(req, res) {

			if(!req.query.iframe) {
				res.send(null);
			}
			request({url:decodeURI(req.query.iframe), headers: {'User-Agent': 'request'}}, function (error, response, body) {
				console.log(req.query.iframe);
				if (!error && response.statusCode == 200) {
					console.log('https://' + response.req._headers.host + '/' + response.req.path);
					res.send(getData(body));
				}
				else {
					console.log('https://' + response.req._headers.host + '/' + response.req.path);

					if('https://' + response.req._headers.host + '/' + response.req.path) {

						var command = 'curl ' + 'https://' + response.req._headers.host + response.req.path;
						console.log(command);
						child = exec(command, function(error, stdout, stderr){
							res.send(getData(stdout));
						});

					}
					else {
						res.send('Not found. Please click on apply to see job details.');
					}

				}
			})


		})
}



function getData(data) {
	data.replace('http://','https://');
	$ = cheerio.load(data);
	$('img').remove();

	if (data.indexOf('/images/indeed.png') > -1) {
		return indeed($)
	}

	return $.html()
}


function indeed($) {

	$('#indeed_apply').remove();
	$('.result-link-bar-container').remove();
	$('.recJobs').remove();

	var content = $('#job-content');
	

	return content.html();
}

