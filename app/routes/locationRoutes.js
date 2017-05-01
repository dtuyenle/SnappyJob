var moment 			= require('moment');
var _ 				= require('underscore');

var Authentication 	= require(__base + 'middleware/authentication');
var Location     	= require(__base + 'models/Location');
var Content     	= require(__base + 'models/Content');


module.exports = function(app, passport) {


	app.route('/locations')

		// create a location
		.post(function(req, res) {
			
			var location = new Location();

			location.content_id	= req.body.content_id;
			location.address	= req.body.address;
			location.city		= req.body.city;
			location.state		= req.body.state;
			location.zip		= req.body.zip;
			location.long		= req.body.long;
			location.lat		= req.body.lat;

			location.save(function(err) {
				if (err) {
					return res.send(err);
				} else {
					return res.json({ message: 'Location created!' });
				}
			});

			
		})

		// get all the location
		.get(function(req, res) {
			
			req.query.lon 		= req.query.lon ? req.query.lon : null;
			req.query.lat 		= req.query.lat ? req.query.lat : null;
			req.query.jobtitle 	= req.query.jobtitle ? new RegExp(req.query.jobtitle,'i') : new RegExp('','i');

			var query = Location.find({ 
				content_id: { $ne: null },
				updatedDate:{ 
					'$lt': new Date(moment.utc().format('YYYY-MM-DD') + ' 23:59:59 UTC'),
					'$gte': new Date(moment.utc().subtract(30,'day').format('YYYY-M-DD') + ' 23:59:59 UTC')
				}
			});
			if(req.query.lon && req.query.lat) {
				if(req.query.max) {
					query.where('loc').near({ center: [req.query.lon,req.query.lat], maxDistance: req.query.max });
				}
				else {
					query.where('loc').near({ center: [req.query.lon,req.query.lat], maxDistance: 10 });
				}
			}

			Location.count({}, function(err, count) {
				if (err) {
					res.send(err);
				} else {

					query
					.populate({
						path: 'content_id',
						options:{
							populate: 'tags_id contact_id location_id asset_id',
						},
						sort: { 
							'publishedDate': -1 
						},
						match: { 
							name: req.query.jobtitle
						}
					})
					.skip(req.query.skip)
					.limit(req.query.limit)
					.exec(function(err, locations) {
						var return_arr = [];
						if (err)
							return res.send(err);
						_.each(locations,function(location){
							if(location.content_id!==null) {
								return_arr.push(location)
							}
						})
						return res.json({ locations: return_arr, total: count});
					});
				}
			})
			
		});


	app.route('/locations/latest')
		// get all the location
		.get(function(req, res) {
			
			req.query.lon 		= req.query.lon ? req.query.lon : null;
			req.query.lat 		= req.query.lat ? req.query.lat : null;
			req.query.jobtitle 	= req.query.jobtitle ? new RegExp(req.query.jobtitle,'i') : new RegExp(' ','i');


			var query = Location.find();
			if(req.query.lon && req.query.lat) {
				query.where('loc').near({ center: [req.query.lon,req.query.lat], maxDistance: 0.50 })
			}

			Location.count({}, function(err, count) {
				if (err) {
					res.send(err);
				} else {
					query
					.populate({
						path: 'content_id',
						options:{
							populate: 'tags_id contact_id location_id',
						},
						sort: { 
							'publishedDate': -1 
						},
						match: { 
							name: req.query.jobtitle,
							updatedDate:{ 
								'$lt': new Date(moment.utc().format('YYYY-MM-DD') + ' 23:59:59 UTC'),
								'$gte': new Date(moment.utc().subtract(30,'day').format('YYYY-M-DD') + ' 23:59:59 UTC')
							}
						}
					})
					.skip(req.query.skip).limit(1000)
					.exec(function(err, locations) {
						if (err)
							return res.send(err);
						return res.json({ locations: locations, total: count});
					});
				}
			})
			
		});


	app.route('/locations/:location_id')

		// get the location with that id
		.get(function(req, res) {
			Location.findById(req.params.location_id, function(err, content) {
				if (err) {
					res.send(err);
				} else {
					res.json(content);
				}
			});
		})

		// update the location with this id
		/*.put(function(req, res, next) {
			Location.findById(req.params.location_id, function(err, location) {

				if (err)
					res.send(err);

					
				location.content_id	= req.body.content_id;
				location.address	= req.body.address;
				location.city		= req.body.city;
				location.state		= req.body.state;
				location.zip		= req.body.zip;
				location.long		= req.body.long;
				location.lat		= req.body.lat;

				location.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Location updated!' });
					next();
				});

			});
		})*/

		// delete the location with this id
		/*.delete(function(req, res, next) {
			Location.remove({
				_id: req.params.location_id
			}, function(err, location) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
				next();
			});
		});*/


}
