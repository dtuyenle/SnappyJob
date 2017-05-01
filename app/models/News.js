// app/models/Content.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our news model
var newsSchema = mongoose.Schema({
    uid: {type: String },
    url : { type: String },
    main_image: { type: String },
    title : { type: String, required: false, minlength: 0, maxlength: 3000 },
    text : { type: String, required: false, minlength: 0, maxlength: 300000 },
    published : { type: Date, default: Date.now },
});


// create the model for news and expose it to our app
module.exports = mongoose.model('news', newsSchema);