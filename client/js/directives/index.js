'use strict';

var app = require('angular').module('snappyjob');

app.directive('dropdown', require('./dropdownDirective'));
app.directive('ngThumb', require('./fileuploadDirective'));
app.directive('shareLinks', require('./socialsharingDirective'));
app.directive('onLastRepeat', require('./twitterDirective'));

