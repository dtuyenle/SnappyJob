
var Authentication 	= require(__base + 'middleware/authentication');
var Tag     		= require(__base + 'models/Tag');

module.exports = function(app, passport) {


	app.route('/tags')

		// create a tag
		.post(function(req, res) {
			
			var tag = new Tag();

			tag.content_id	= req.body.content_id;
			tag.tag			= req.body.tag;

			tag.save(function(err) {
				if (err) {
					res.send(err);
				}
				else {
					res.json({ message: 'Tag created!' });
				}
			});

			
		})

		// get all the tag
		.get(function(req, res) {
			Tag.find(function(err, tags) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(tags);
				}
			});
		});



	app.route('/tags/:tag_id')

		// get the tag with that id
		.get(function(req, res) {
			Tag.findById(req.params.tag_id, function(err, tag) {
				if (err) {
					res.send(err);
				} else {
					res.json(tag);
				}
			});
		})

		// update the tag with this id
		/*.put(function(req, res) {
			Tag.findById(req.params.tag_id, function(err, tag) {

				if (err)
					res.send(err);

				tag.content_id	= req.body.content_id;
				tag.tag			= req.body.tag;

				tag.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Tag updated!' });
				});

			});
		})*/

		// delete the tag with this id
		/*.delete(function(req, res) {
			Tag.remove({
				_id: req.params.tag_id
			}, function(err, tag) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});*/


}