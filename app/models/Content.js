// app/models/Content.js
// load the things we need
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our content model
var contentSchema = mongoose.Schema({

    slug            : { type: String },
    name            : { type: String, required: false, minlength: 0, maxlength: 300 },
    url             : { type: String, minlength: 0, maxlength: 3500 },
    content_type    : { type: String },
    description     : { type: String, required: true, minlength: 20, maxlength: 20000 },
    description_details: { type: String, default: '' },
    budget          : { type: String, required: false, minlength: 0, maxlength: 150 },
    crawl           : { type: Boolean },
    location_id		: { type: Schema.Types.ObjectId, ref: 'locations' },
	contact_id		: { type: Schema.Types.ObjectId, ref: 'contacts' },
	tags_id			: [{ type: Schema.Types.ObjectId, ref: 'tags' }],
    type            : { type: String },
    salary          : { type: String },
    asset_id        : { type: Schema.Types.ObjectId, ref: 'assets', default: null },
    startDate       : { type: Date, default: Date.now },
    endDate         : { type: Date, default: Date.now },
    publishedDate   : { type: Date, default: Date.now },
    updatedDate     : { type: Date, default: Date.now },

});

// methods ======================

contentSchema.pre('save',function(next){

    var errors = [];

    //if(this.name.length < 20 || this.name.length > 500)
    //    errors[errors.length] = {field:"title",message:"title invalid"};

    if(errors.length > 0){
        var error = new Error("Invalid Input");
        error.errors = errors;
        next(error);
    }
    next();

});


// create the model for contents and expose it to our app
module.exports = mongoose.model('contents', contentSchema);