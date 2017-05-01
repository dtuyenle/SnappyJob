
var Authentication 	= require(__base + 'middleware/authentication');
var Contact     	= require(__base + 'models/Contact');

module.exports = function(app, passport) {


	app.route('/contacts')

		// create a contact
		.post(function(req, res) {
			
			var contact = new Contact();

			contact.content_id	= req.body.content_id;
			contact.phone		= req.body.phone;
			contact.email		= req.body.email;

			contact.save(function(err) {
				if (err) {
					res.send(err);
				}
				else {
					res.json({ message: 'Contact created!' });
				}
			});

			
		})

		// get all the contact
		.get(function(req, res) {
			Contact.find(function(err, contacts) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(contacts);
				}
			});
		});



	app.route('/contacts/:contact_id')

		// get the contact with that id
		.get(function(req, res) {
			Contact.findById(req.params.contact_id, function(err, contact) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(contact);
				}
			});
		})

		// update the contact with this id
		/*.put(function(req, res) {
			Contact.findById(req.params.contact_id, function(err, contact) {

				if (err)
					res.send(err);

				contact.content_id	= req.body.content_id;
				contact.phone		= req.body.phone;
				contact.email		= req.body.email;

				contact.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Contact updated!' });
				});

			});
		})*/

		// delete the contact with this id
		/*.delete(function(req, res) {
			Contact.remove({
				_id: req.params.contact_id
			}, function(err, contact) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});*/


}