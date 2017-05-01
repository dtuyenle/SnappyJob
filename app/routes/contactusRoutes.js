
var Authentication 	= require(__base + 'middleware/authentication');
var ContactUs     	= require(__base + 'models/ContactUs');

module.exports = function(app, passport) {


	app.route('/contactus')

		// create a contactus
		.post(function(req, res) {
			
			var contactus = new ContactUs();

			contactus.name			= req.body.name;
			contactus.address		= req.body.address;
			contactus.email			= req.body.email;
			contactus.description	= req.body.description;

			contactus.save(function(err) {
				if (err) {
					res.send(err);
				}
				else {
					res.json({ message: 'Contact Us created!' });
				}
			});

			
		})



}