var Twit 			= require('twit');
var _ 				= require('underscore');

var Authentication 	= require(__base + 'middleware/authentication');
var Twitter     	= require(__base + 'models/Twitter');


var T = new Twit({
	consumer_key:         'JCdi5ohXvJ63ZZ3K2G1hOCh5X'
  , consumer_secret:      'CPRHhmcdNSuPwqTV3UgnMvoqusIrlT8PttCYHNYPVmjnegVJP4'
  , access_token:         '1273859522-ItR30I1OBMN7PiyFeKp7mZboHVLbmIuHt7X8ajM'
  , access_token_secret:  'S84M7fzmqONwRXlBU4QpOCn2tbb2I4ouw6ZlC7mDoZHc2'
})


module.exports = function(app, passport) {

    /*app.get('/twitter', function(req, res) {


    	Twitter
    	.find()
    	.exec(function(err, tweets) {
			if (err)
				res.send(err);
			res.json(tweets[0].content); 
		});


    	var lat = req.query.lat;
    	var lon = req.query.lon;

    	var date 	= new Date();
    	var year 	= date.getFullYear();
    	var month 	= parseInt(date.getMonth()) ;
    	var day 	= parseInt(date.getDate()) - 5;
    	var date_str= year + '-' + month + '-' + day;


		function getTweets(return_data,array,i,lat,lon) {

			if(i === array.length) { 

				// run everyday
				var twitter = new Twitter();
				Twitter.find().remove().exec();
				twitter.content = return_data;
				twitter.save(function(err,content_data) {
					if (err)
						res.send(err);
				});

				res.json(return_data); 

				return false 

			}

			T.get('search/tweets', { q: array[i], count: 1000000000 }, function(err, data, response) {
				if( i === 0) { 
					return_data = data; 
				}
				else {
					if(typeof(data) !== 'undefined') {
  						_.each(data.statuses,function(item){
  							return_data.statuses.push(item);
  						})
  					}
  				}
  				getTweets(return_data,array,i + 1);
		  	})

		}

		var return_data = null;
		var array = ['student job','gigjob','occasional job', 'occasional-job', 'cook', 'waitor', 'waitress', 'customer service', 'part time', 'part-time', 'summer-job', 'summer job', 'job'];
		var i = 0;

		getTweets(return_data,array,i,lat,lon);


    });*/


	app.get('/twitter/:state?', function(req, res) {

		if(!req.params.state) {
			res.json({
				twitter_id: '617001486631993344'
			})
			return false
		}
		else {

			Twitter
	    	.find({
	    		'state': req.params.state
	    	})
	    	.exec(function(err, tweets) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(tweets[0]); 
				}
			});

	    }

	})


	

}


			

