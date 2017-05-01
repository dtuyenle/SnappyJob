// app/models/Content.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our tips model
var tipsSchema = mongoose.Schema({
    img: {type: String}
});


// create the model for tips and expose it to our app
module.exports = mongoose.model('tips', tipsSchema);