var url_ = "https://www.ziprecruiter.com/clk/aaa-mid-atlantic-00000000-occasional-receptionist-1843514756?clk=1S9qwOIsggKgo_7_pk5_vH8tD3eIXphj4ExZ4AJiONvkVivYjLEfwsVP_HNm5bcxs2xaeR3CACVAbFnNhO__QdUJ9-a1xUuUqclQ2hBtsd5TwHezmHmsiBffW-KK6-MNF0ncZ7Tl5zE7vvrMpFPyBdhSUoIPac5H9SdN7qupta-yVgYWsmVotvxZ7n0gZ8pgu6zRXVBUR6pYyQokzDkmkVn1zV9sPpGdrT89LJIiG_zOKMd0GYz54EH5KumzTD2NpklLzjPXFWBvRpMkDZza1NO2uYEOVnOF13kfT31KRofnK7YawppzDVu_Y37hxPRYN7IWhewQt3GEbc6Gg9UpX8bWrtBQXX6ADwMYfQsCw1JpkcU-Yo3vZgIvVm10tX8wx0_ZeKLRzFHY8ekZNvtKPmqJlK8xpJ3Yk_4S6kVDt-DFz82hdxvPr4gMZA9Y7WsyEvh0uD-BWFhTKnqtb-r4NXA2gajslZugAq5cdaw86_QejtenqTu2y5zW2cAnSAfNfllWEfpFNRO8_ey_HZJ9JQjf5hQIzTiZQeOeLy6e5LUGYJtk_xMeEUdxX4ucZjXxfYAU5dFCvpQ1xHanfyCDiNgryPJYeAbAIV41nzpzvDMCkg42XZqAaNabh2_ejtgODUzHQvHtQfuMBI0ZV6iwlYeJ04UmJOCJ2c3XLLbtvMAO93Cl6VkB2EPr2t7TELI4ImHuzFVDRWaFCd7Re-YIh7jtCAUNmBc_ocQ1fYgduJAIRr6f-Yc0kfAkfciogxXQFoQ2jHSgxgZ_8LsjSksKnIoDzkzYgxn6Rw1nj2gLKymby4NdLAdGo1MY2GYr_t3Bwq0fB3u3crVIZ4eu8x1or8HBJeRfB3Y92WsVaKFr85WJton8PPX8dHBYg1GkKUwrfUkm1jo7yG6RssrGjs5fck2GkCjJRzqsZwUQlwaL_yCrtm8vg_JUCpYlRCw5RGR6LLHJumu3B_7ujDOsZOtC-13yya_TkRD9dMy3hpI91wQ.953fd68044763bc0c98824f2234c03f7";

var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var exec = require('child_process').exec;
var url=require('url');
var fs = require('fs');

request({url:decodeURI(url_), headers: {'User-Agent': 'request'}}, function (error, response, body) {

	if (!error && response.statusCode == 200) {
		
		if(body.toLowerCase().indexOf('javascript disabled') > -1 || body.toLowerCase().indexOf('javascript enabled') > -1) {
			if(response.req._headers.host.indexOf('jobing') > -1) {
				body = body.replace('http://','https://');
				$ = cheerio.load(body);
				var url1 = $('a').attr('href');
				

				request({url:decodeURI(url1), headers: {'User-Agent': 'request'}}, function (error, response, body) {
					if (error) {
						return console.error('upload failed:', error);
					}
					console.log('Upload successful!  Server responded with:' + body);
				});
			}

			if(response.req._headers.host.indexOf('juju') > -1) {
				body = body.replace('http://','https://');
				$ = cheerio.load(body);
				var url1 = $('a').attr('href');
				

				request({url:decodeURI(url1), headers: {'User-Agent': 'request'}}, function (error, response, body) {
					if (error) {
						return console.error('upload failed:', error);
					}
					//console.log('Upload successful!  Server responded with:' + body);
				});
			}

			if(response.req._headers.host.indexOf('glassdoor') > -1) {
				var body = body.replace('http://','https://');
				var url1 = body.match(/access(.*?)from/i)[1];

				request({url:decodeURI(url1), headers: {'User-Agent': 'request'}}, function (error, response, body) {
					if (error) {
						return console.error('upload failed:', error);
					}
					console.log('Upload successful!  Server responded with:' + body);
				});
			}


		}
		
	}
	else {
		console.log('https://' + response.req._headers.host + '/' + response.req.path);
		console.log(response.statusCode);
		console.log(response.req._headers.host.indexOf('glassdoor'));
		console.log(error);

		if('https://' + response.req._headers.host + '/' + response.req.path) {

			var command = 'curl ' + 'https://' + response.req._headers.host + response.req.path;
			console.log(command);
			child = exec(command, function(error, stdout, stderr){
				console.log(stdout);
			});

		}
		else {
			console.log('Not found. Please click on apply to see job details.');
		}

	}
})