var _ 				= require('underscore');

var Authentication 	= require(__base + 'middleware/authentication')
var util    		= require(__base + 'util/util_master');
var Content     	= require(__base + 'models/Content');
var Apply    		= require(__base + 'models/Apply');

module.exports = function(app, passport) {

	app.route('/apply')

		// create a content
		.post(function(req, res) {
			
			var apply 	= new Apply();

			Content.findOne({ _id: req.body.content_id }, function (err, content_data){
				if (err)
					res.send(err);

				// @Todo: escape javascript
				apply.content_id	= content_data;
				apply.email 		= req.body.email;
				apply.title 		= req.body.title;
				apply.body 			= req.body.body;
				apply.applyDate 	= req.body.applyDate;

				apply.save(function(err,apply_data) {
					if (err) {
						res.send(err);
					}
					else {

						var data = {
							email: apply_data.email,
				  			subject: apply_data.title,
				  			text: apply_data.body,
				  			html: apply_data.body
						}

						util.get('util_email').send(data, res, 'apply_to', function(){
							
							res.json({status : 'Successfully applied.'});

							var data = {
								email: apply_data.email,
					  			url: 'http://www.snappyjob.net/#/snappyapply/' + apply_data.content_id._id
							}

							util.get('util_email').send(data, res, 'apply_confirm', function(){
								console.log({status : 'Successfully applied.'});
							})

							next();

						});
					}
				});
			})

			
		})


}