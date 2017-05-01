'use strict';

module.exports = function($http) {
  	return new function() {

  		var that = this;

        this.apply = {};
        this.apply.content_id      = '';
        this.apply.email           = '';
        this.apply.title           = '';
        this.apply.body            = '';
        this.apply.applyDate       = '';

        this.load = function(data) {
            for(var prop in data) {
                that.apply[prop] = data[prop]
            }
        }

        this.validation = function() {
            if(!this.apply.email.length ||
                !this.apply.body.length
            ) {
                return false
            }
            else {
                return true
            }
        }

        this.save = function(successCallback, errCallback) {
            this.applyDate= (new Date()).toString();

            // validation
            if(!this.validation()) { errCallback(); return false }

            $http({
                url: "/apply",
                method: 'POST',
                data: {
                    content_id  : that.apply.content_id,
                    body        : that.apply.body,
                    email       : that.apply.email,
                    applyDate   : new Date()
                }
            }).success(function(data, status, headers, config) {

                successCallback();

            }).error(function(data, status, headers, config) {
                errCallback();
            });
        }

        this.getData = function(apply){
            apply.diffDate = parseInt(moment(new Date()).diff(moment(new Date(apply.applyDate)), 'days'));
            apply.diffDate = apply.diffDate == 0 ? 'today' : apply.diffDate + ' days ago';  
            return apply
        }


	}

}