// app/models/Tag.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our tag model
var tagSchema = mongoose.Schema({

	content_id	: { type: Schema.Types.ObjectId, ref: 'contents' },
	tag 		: { type: String }


});

// methods ======================


// create the model for tags and expose it to our app
module.exports = mongoose.model('tags', tagSchema);