'use strict';

module.exports = function($http, geoService) {
  	return new function() {

  		var that = this;

        this.twitter = {};
        this.twitter.twitter_id      = '';
        this.twitter.state           = '';
        this.twitter.state_name      = '';


        this.load = function(data) {
            for(var prop in data) {
                that.twitter[prop] = data[prop]
            }
        }

        this.get = function(callback) {
            $http({
                url: "/twitter/" + geoService.state,
                method: 'GET',
            }).success(function(data, status, headers, config) {
                that.load(data);
                if(callback) {
                    callback(data);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        } 

	}

}