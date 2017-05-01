// app/models/Apply.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our contact model
var applySchema = mongoose.Schema({

	content_id		: { type: Schema.Types.ObjectId, ref: 'contents' },
	email 			: { type: String, required: true, match: /.+\@.+\..+/, minlength: 5, maxlength: 150 },
	title 			: { type: String, required: false, minlength: 0, maxlength: 300 },
	body 			: { type: String, required: true, minlength: 10, maxlength: 10000 },
    applyDate   	: { type: Date, default: Date.now },

});

// methods ======================


// create the model for applys and expose it to our app
module.exports = mongoose.model('applys', applySchema);