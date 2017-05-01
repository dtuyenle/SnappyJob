'use strict';

module.exports = function($http, $q) {
  	return function() {

  		var that = this;

        this.location = {};
        this.location.content_id      = '';
        this.location.address         = '';
        this.location.city            = '';
        this.location.state           = '';
        this.location.zip             = '';
        this.location.loc             = []; // lng lat


        this.load = function(data) {
            for(var prop in data) {
                that[prop] = data[prop]
            }
        }

	}

}