// app/models/Location.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our location model
var locationSchema = mongoose.Schema({

	content_id	: { type: Schema.Types.ObjectId, ref: 'contents' },
	address 	: { type: String, minlength: 0, maxlength: 300 },
	city 		: { type: String, required: true, minlength: 2, maxlength: 150 },
	state 		: { type: String, required: true, minlength: 2, maxlength: 150 },
	zip 		: { type: String, minlength: 0, maxlength: 10 },
	loc: {
    	type: [Number],  // [<longitude>, <latitude>]
    	index: '2d'      // create the geospatial index
    }
});


// methods ======================


// create the model for locations and expose it to our app
module.exports = mongoose.model('locations', locationSchema);