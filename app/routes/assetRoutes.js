var multer  	 	= require('multer');

var Authentication 	= require(__base + 'middleware/authentication');
var Asset     		= require(__base + 'models/Asset');

module.exports = function(app, passport) {

	app.route('/asset/image')

		// create a Asset
		.post(function(req, res) {

			var handler = multer({

		    	dest: './uploads/images/',

			    onFileUploadStart: function (file) {
			      	// You now have access to req
			      	console.dir(req);
			      	console.log(file.fieldname + ' is starting ...')
			    },

			    onFileUploadComplete: function (file) {
		      		var asset = new Asset();

					asset.path 	= req.files.file ? req.files.file[0].path.replace('uploads','') : '';
					asset.type	= req.params.type;

					asset.save(function(err, data) {
						if (err) {
							res.send(err);
						} else {
							res.json({ message: 'Asset created!', asset_data: data });
						}
					});
			    }

		  	});
		  	
		  	handler(req, res, function(){
		  		return false
		  	});
			
		})

		// get all the Asset
		.get(function(req, res) {
			Asset.find(function(err, assets) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(assets);
				}
			});
		});

}