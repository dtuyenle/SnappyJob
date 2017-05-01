var natural = require('natural');
var classifier = new natural.BayesClassifier();
var tokenizer = new natural.WordTokenizer();

// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/snappyjob', function (error) {
    if (error) {
        console.log(error);
    }
});
var Schema   = mongoose.Schema;

// Mongoose Schema definition
var nltkSchema = mongoose.Schema({
    name : { type: String },
    salary: {type: String},
    type: { type: String }
});
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

var Nltk =  mongoose.model('nltk', nltkSchema);
var Contents =  mongoose.model('contents', contentSchema);
var salary_data= {};

Nltk.find().then(function(items) {

	for(var i = 0, length = items.length; i < length; i++) {
		var item = items[i]
		classifier.addDocument(item.name, item.name);
		salary_data[item.name] = item.salary;
	}
	classifier.train();


	Contents.find({"salary": null}).then(function(content_s) {


		for(var j = 0, length = content_s.length; j < length; j++) {

			(function(){
				var content_ = content_s[j];
				
				var new_name = classifier.classify(content_['name']);
				var salary = salary_data[new_name];

				console.log(content_['name'], ' --- ' + new_name);


				Contents.findById(content_['_id'], function(err, content_item) {

					if (err) {
						console.log(err);
					}

					if(content_item) {
						content_item.type = new_name;
						content_item.salary = salary;

						content_item.save(function(err) {
							if (err) {
								console.log(err);
							}
							console.log({ message: 'Content updated! ' + new_name + ' ' + salary });
						});
					}

				});

			})()
		}
	})


})




