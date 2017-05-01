var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');
var util = require('util');
var exec = require('child_process').exec;
var url=require('url');
var fs = require('fs');


// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB (ted/ted is readonly)
mongoose.connect('mongodb://localhost/snappyjob', function (error) {
    if (error) {
        console.log(error);
    }
});
var Schema   = mongoose.Schema;

// Mongoose Schema definition
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
    asset_id        : { type: Schema.Types.ObjectId, ref: 'assets', default: null },
    startDate       : { type: Date, default: Date.now },
    endDate         : { type: Date, default: Date.now },
    publishedDate   : { type: Date, default: Date.now },
    updatedDate     : { type: Date, default: Date.now },

});

Content =  mongoose.model('contents', contentSchema);


Content
.find()
.select({_id: 1, url: 1})
.exec(function(err, contents) {
	console.log(contents.length);
	if(err) {
		console.log(err);
	}

	var urls = {};
	_.each(contents, function(content) {
		console.log(content.url);
		urls[url.parse(content.url).hostname] = 1;
	})

	fs.writeFile("./urls.json", JSON.stringify(urls), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 


})

