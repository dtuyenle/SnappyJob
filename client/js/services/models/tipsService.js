'use strict';

module.exports = function($http) {
    return new function() {

        var that = this;

        this.img = '';
        this.data = [];

        this.get = function(limit, offset, callback) {
            $http({
                url: "/tips?limit=" + limit + "&skip=" + offset,
                method: 'GET',
            }).success(function(data, status, headers, config) {
                if(callback) {
                    callback(data);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        } 

    }

}