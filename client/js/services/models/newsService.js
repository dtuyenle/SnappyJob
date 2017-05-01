'use strict';

module.exports = function($http) {
    return new function() {

        var that = this;

        this.uid = '';
        this.url = '';
        this.main_image = '';
        this.title = '';
        this.text = '';
        this.published = new Date();

        this.data = [];

        this.get = function(limit, offset, callback) {
            $http({
                url: "/news?limit=" + limit + "&skip=" + offset,
                method: 'GET',
            }).success(function(data, status, headers, config) {
                // this.data = this.data.concat(data);
                for(var i = 0, length = data.news.length; i < length; i++) {
                    data.news[i].text = data.news[i].text.replace(/<[^>]+>/gm, '').split(/\s+/).slice(1,60).join(" ") + ' ...';
                    data.news[i].published = moment(new Date(data.news[i].published)).format('LL');               
                
                }

                if(callback) {
                    callback(data);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        } 

    }

}