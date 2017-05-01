'use strict';

module.exports = function($http) {
  	return function() {

  		var that = this;

        this.contact = {};
        this.contact.content_id      = '';
        this.contact.email           = '';
        this.contact.phone           = '';


        this.load = function(data) {
            for(var prop in data) {
                that.contact[prop] = data[prop]
            }
        }


	}

}