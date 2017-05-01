// app/models/Contact.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our contact model
var contactSchema = mongoose.Schema({

	content_id		: { type: Schema.Types.ObjectId, ref: 'contents' },
	email 			: { type: String, required: true, match: /.+\@.+\..+/, minlength: 5, maxlength: 150 },
	encrypted_email : { type: String, select: false},
	phone 			: { type: String, minlength: 0, maxlength: 20, select: false }


});

// methods ======================


// create the model for contacts and expose it to our app
module.exports = mongoose.model('contacts', contactSchema);