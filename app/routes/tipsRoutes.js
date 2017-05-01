var _ 				= require('underscore');

var Authentication 	= require(__base + 'middleware/authentication')
var util    		= require(__base + 'util/util_master');
var Tips     		= require(__base + 'models/Tips');

module.exports = function(app, passport) {

	app.route('/tips')

		// get all the tips
		.get(function(req, res) {

			var random = Math.floor(Math.random() * 10);
			// req.query.skip + Math.floor(Math.random() * 10);
			var limit = 10;

			Tips.find()
			//.limit(limit)
			.exec(function(err, tips) {
				if (err) {
					res.send(err);
				} else {
					res.json({'tips': tips});
				}
			});
		})

}