// app/models/ContactUs.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our contact model
var contactusSchema = mongoose.Schema({

	name			: { type: String, required: true, maxlength: 100 },
	email 			: { type: String, required: true, match: /.+\@.+\..+/, minlength: 5, maxlength: 150 },
	address 		: { type: String, minlength: 0, maxlength: 300 },
    description     : { type: String, required: true, minlength: 20, maxlength: 20000 },

});

// methods ======================


// create the model for contacts and expose it to our app
module.exports = mongoose.model('contactuss', contactusSchema);