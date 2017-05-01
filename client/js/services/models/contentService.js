'use strict';

module.exports = function(
    $http, geoService, contentFactory, contactFactory, 
    locationFactory, tagFactory, assetFactory
) {

  	return new function() {

  		var that = this;

        this.contents       = [];
        this.total          = 1;
        this.bad_contents   = [];

        this.load = function(params,callback) {
            $http({
                url: "/locations",
                method: 'GET',
                params: params
            }).success(function(data, status, headers, config) {

                that.total = data.total; 
                var return_data = that.loadData(data);

                callback(return_data);

            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        this.loadData = function(data) {
            var return_data = [];
            _.each(data.locations, function(location){

                if(typeof(location.content_id) ==='undefined' || location.content_id === null) { 
                    that.bad_contents.push(location); 
                }
                else {
                    if(location.content_id.name === '' || location.content_id.description === null) {
                        that.bad_contents.push(location); 
                    }   
                    else {
                        that.contents.push(that.getData(location));
                        return_data.push(that.getData(location));
                    }
                }
            })

            // remove duplicate for shiftgig
            return_data = _.filter(return_data, function (element, index) {
                // tests if the element has a duplicate in the rest of the array
                for(index += 1; index < return_data.length; index += 1) {
                    if (element.content.content_type == 'shiftgig' && _.isEqual(element.content.name, return_data[index].content.name)) {
                        return false;
                    }
                }
                return true;
            });

            return return_data
        }

        this.getData = function(location) {
            var content = new contentFactory();
            content.load(location.content_id);
            var contact = new contactFactory();
            contact.load(location.content_id.contact_id);
            var location_ = new locationFactory();
            location_.load(location.content_id.location_id);

            content.content.contact_id = contact;
            content.content.location_id = location_;

            var tags = [];
            _.each(location.content_id.tags_id,function(tag){
                tags.push( (new tagFactory()).load(tag) );
            })
            content.content.tags_id = tags;

            return content
        }


	}

}

