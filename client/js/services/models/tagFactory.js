'use strict';

module.exports = function($http) {
  	return function() {

  		var that = this;

        this.tag = {};
        this.tag.content_id    = '';
        this.tag.tag           = '';


        this.load = function(data) {
            for(var prop in data) {
                that.tag[prop] = data[prop]
            }
        }


	}

}