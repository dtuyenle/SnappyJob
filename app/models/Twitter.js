// app/models/Twitter.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our tag model
var twitterSchema = mongoose.Schema({

	twitter_id: { type: String },
	state 	  : { type: String },
	state_name: { type: String }
	//content	: { type: Schema.Types.Mixed },

});

// methods ======================


// create the model for twitter and expose it to our app
module.exports = mongoose.model('twitters', twitterSchema);