'use strict';

var app = require('angular').module('snappyjob');

app.service('bookmarkService', require('./bookmarkService'));
app.service('filterService', require('./filterService'));
app.service('geoService', require('./geoService'));
app.service('navService', require('./navService'));
app.service('searchService', require('./searchService'));
app.service('wallService', require('./wallService'));


app.service('applyService', require('./models/applyService'));
app.service('assetFactory', require('./models/assetFactory'));
app.service('contactFactory', require('./models/contactFactory'));
app.service('contentFactory', require('./models/contentFactory'));
app.service('contentService', require('./models/contentService'));
app.service('locationFactory', require('./models/locationFactory'));
app.service('tagFactory', require('./models/tagFactory'));
app.service('twitterService', require('./models/twitterService'));
app.service('newsService', require('./models/newsService'));
app.service('tipsService', require('./models/tipsService'));
