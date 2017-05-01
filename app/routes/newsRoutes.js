var _ 				= require('underscore');

var Authentication 	= require(__base + 'middleware/authentication')
var util    		= require(__base + 'util/util_master');
var News     		= require(__base + 'models/News');

module.exports = function(app, passport) {

	app.route('/news')

		// get all the news
		.get(function(req, res) {

			var random = req.query.skip === 0 ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 100);
			// req.query.skip + Math.floor(Math.random() * 10);

			News.find()
			.skip(random).limit(req.query.limit)
			.exec(function(err, news) {
				if (err) {
					res.send(err);
				} else {
					res.json({'news': news});
				}
			});
		})


}