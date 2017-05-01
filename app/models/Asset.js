// app/models/Asset.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our tag model
var assetSchema = mongoose.Schema({

	path		    : { type: String },
    alt 			: '',
    type            : { type: String }, // image/audio

    blob_url 		: { type:String, minlength: 0, maxlength: 10000000 },
    base64_data 	: { type:String, minlength: 0, maxlength: 10000000 },


    createdDate   	: { type: Date, default: Date.now },
    updatedDate     : { type: Date, default: Date.now },
    

});

// methods ======================


// create the model for assets and expose it to our app
module.exports = mongoose.model('assets', assetSchema);