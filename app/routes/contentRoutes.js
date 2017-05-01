var _ 				= require('underscore');

var Authentication 	= require(__base + 'middleware/authentication')
var util    		= require(__base + 'util/util_master');
var Content     	= require(__base + 'models/Content');
var Location    	= require(__base + 'models/Location');
var Tag    			= require(__base + 'models/Tag');
var Contact    		= require(__base + 'models/Contact');
var Apply    		= require(__base + 'models/Apply');

module.exports = function(app, passport) {

	app.route('/contents')

		// create a content
		.post(function(req, res) {
			
			var content = new Content();

			content.name 			= req.body.content.name;
			content.slug 			= req.body.content.slug;
			content.url  			= req.body.content.url;
			content.content_type 	= req.body.content.content_type;
			content.description 	= req.body.content.description;
			content.budget 			= req.body.content.budget;
			content.crawl 			= false;
			content.asset_id 		= req.body.content.asset_id;
			content.startDate 		= req.body.content.startDate;
			content.endDate 		= req.body.content.endDate;
			content.publishedDate 	= req.body.content.publishedDate;
			content.updatedDate 	= req.body.content.updatedDate;


			content.save(function(err,content_data) {
				if (err) {
					res.send(err);
				} else {
					// create a location
					var location = new Location();

					location.content_id = content_data;
					location.city 		= req.body.location.city;
					location.zip  		= req.body.location.zip;
					location.loc 		= [req.body.location.loc[0],req.body.location.loc[1]]
					location.state 		= req.body.location.state;
					location.address 	= req.body.location.address;

					location.save(function(err,location_data) {
						if (err) {
							res.send(err);
						} else {
							// create a contact
							var contact = new Contact();

							contact.content_id 		= content_data;
							contact.phone 			= req.body.contact.phone;
							contact.email 			= req.body.contact.email;
							contact.encrypted_email = util.get('util').hashIt(contact.email);

							contact.save(function(err, contact_data) {

								if (err) {
									res.send(err);
								}
								else {
									Content.findOne({ _id: content_data._id }, function (err, doc){
										if (err) {
											res.send(err);
									  	} else {
										  	doc.contact_id  = contact_data;
										  	doc.location_id = location_data;
										  	doc.save(function(err){

										  		var data = {
										  			email: contact.email,
										  			subject: content.name,
										  			text: content.description,
										  			html: content.description,
										  			url: 'http://www.snappyjob.net/#/snappyapply/' + content.id
										  		};

										  		util.get('util_email').send(data, res, 'post', function(){
													res.json({ 
												  		content: doc._id,message: 'Content created!',
												  		location: location_data._id,message: 'Location created!',
												  		contact: contact_data._id,message: 'Contact created!'
												  	});
												});	
										  	});
										}
									});
								}
							})
						}

					})

				}
			})
			
		})

		// get all the content
		.get(function(req, res) {

			Content.find()
			.skip(req.query.skip).limit(req.query.limit)
			.populate('location_id')
			.populate('contact_id')
			.populate('tags_id')
			.exec(function(err, contents) {
				if (err) {
					res.send(err);
				} else {
					res.json({'contents': contents});
				}
			});
		})


	app.route('/contents/:content_id')

		// get the content with that id
		.get(function(req, res) {
			Content.findById(req.params.content_id)
			.populate('location_id')
			.populate('contact_id')
			.populate('tags_id')
			.populate('asset_id')
			.exec(function(err, content) {

				if (err) {
					res.send(err);
				}
				var data = {};
				data.content = content;

				Apply.find({
					content_id: req.params.content_id
				})
				.select("-email")
				.exec(function(err, applies) {

					if (err) {
						res.send(err);
					} else {
						data.applies = applies;
						res.json(data);
					}
				})
				
			});
		})

		// update the content with this id
		/*.put(function(req, res) {
			Content.findById(req.params.content_id, function(err, content) {

				if (err)
					res.send(err);

				content.name 			= req.body.name;
				content.slug 			= req.body.slug;
				content.url  			= req.body.url;
				content.content_type 	= req.body.content_type;
				content.description 	= req.body.description;
				content.budget 			= req.body.budget;
				content.crawl 			= false;
				content.publishedDate 	= req.body.publishedDate;
				content.updatedDate 	= req.body.updatedDate;

				content.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Content updated!' });
				});

			});
		})*/

		// delete the content with this id
		/*.delete(function(req, res) {
			Content.remove({
				_id: req.params.content_id
			}, function(err, content) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});*/


}