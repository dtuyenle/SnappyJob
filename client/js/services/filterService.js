'use strict';

module.exports = function($http,contentService, geoService) {
  	return new function() {

  		this.filters = {};

  		this.getLatest = function(limit,callback) {
  			this.contents = [];
  			var that = this;
			$http({
				url: "/locations/latest",
				method: 'GET',
				params: {
					lat: geoService.lat,
					lon: geoService.lon
				}
			}).success(function(data, status, headers, config) {

				var return_data = [];
				var i = 0;
				_.each(data.locations, function(location) {
					if(i < limit) {
		                if(typeof(location.content_id) !== 'undefined' && location.content_id !== null) { 
		                    if(location.content_id.location_id !== null) {
		                    	return_data.push(contentService.getData(location));
		                    	i++;
		                    }
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


				callback(return_data);
			}).error(function(data, status, headers, config) {
				console.log(data);
			});
  		}



	    this.getNearBy = function(lat,lon,callback) {

	    	$http({
				url: "/locations",
				method: 'GET',
				params: {
					limit 	: 6,
					skip 	: Math.round(Math.random() * 100),
					lat 	: lat,
					lon 	: lon
				}
			}).success(function(data, status, headers, config) {
				
				var return_data = [];
				_.each(data.locations, function(location) {
	                if(typeof(location.content_id) ==='undefined' || location.content_id === null) { 
	                    
	                }
	                else {
	                    return_data.push(contentService.getData(location));
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



		        callback(return_data);

			}).error(function(data, status, headers, config) {
				console.log(data);
			});


	    }


  	};


}