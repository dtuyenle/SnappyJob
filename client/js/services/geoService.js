'use strict';

module.exports =  function($http, $window, localStorageService) {
  	return new function() {

  		var that = this;

  		// MAPS STYLE CONFIG
		this.MAPS_CONFIG={standard:[],gray:[{"stylers":[{hue:"#B9B9B9"},{saturation:-100}]},{"featureType":"landscape","stylers":[{"color":"#E5E5E5"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#DCDCDC"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#B9B9B9"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#E2E2E2"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#ACACAC"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#F6F6F6"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#DDDDDD"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#D3D3D3"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"color":"#DBDBDB"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"color":"#DBDBDB"}]},{"featureType":"poi.place_of_worship","elementType":"geometry","stylers":[{"color":"#DBDBDB"}]},],blue:[{"stylers":[{hue:"#4C95B2"},{saturation:-100}]},{"featureType":"landscape","stylers":[{"color":"#DEE7EB"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#BBE7F9"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#86CEEB"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#C2EDFF"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4DCDFF"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#F3F7F9"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#C6E5F1"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#B7DDEC"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"color":"#D5DDE0"}]},{"featureType":"poi.business","elementType":"geometry","stylers":[{"color":"#D5DDE0"}]},{"featureType":"poi.place_of_worship","elementType":"geometry","stylers":[{"color":"#D5DDE0"}]},]};

		this.address 		= typeof(localStorageService.get('curr-address')) 	!== 'undefined' ? localStorageService.get('curr-address') ? localStorageService.get('curr-address') : "" : "";
		this.lat 			= typeof(localStorageService.get('curr-lat')) 		!== 'undefined' ? localStorageService.get('curr-lat') ? localStorageService.get('curr-lat') : "" : "";
		this.lon 			= typeof(localStorageService.get('curr-lon')) 		!== 'undefined' ? localStorageService.get('curr-lon') ? localStorageService.get('curr-lon') : "" : "";
		this.city 			= typeof(localStorageService.get('curr-city')) 		!== 'undefined' ? localStorageService.get('curr-city') ? localStorageService.get('curr-city') : "" : "";
		this.state 			= typeof(localStorageService.get('curr-state')) 	!== 'undefined' ? localStorageService.get('curr-state') ? localStorageService.get('curr-state') : "" : "";	
		this.zip 			= typeof(localStorageService.get('curr-zip')) 		!== 'undefined' ? localStorageService.get('curr-zip') ? localStorageService.get('curr-zip') : "" : "";	

  		this.calDistance = function(latitude_start,longitude_start, latitude_end,longitude_end) {
            var start = new google.maps.LatLng(parseFloat(latitude_start), parseFloat(longitude_start));
            var end = new google.maps.LatLng(parseFloat(latitude_end), parseFloat(longitude_end));
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(start, end) * 0.621371 / 1000);
        }

        this.loadCurrentLocation = function(startCallback, endCallback) {

			if (navigator.geolocation){

				startCallback();

	            var opts = {
	                enableHighAccuracy: false,
	                timeout: 10000,
	                maximumAge: 0
	            }
	            navigator.geolocation.getCurrentPosition(function(position){

	                // Takes position results and prepares them for data processor
	                that.lat = position.coords.latitude;
	                that.lon = position.coords.longitude;

	                var coordinates  = new google.maps.LatLng(that.lat, that.lon);
	                var opts         = {'latLng':coordinates};

	                localStorageService.set('curr-lat', position.coords.latitude);
	                localStorageService.set('curr-lon', position.coords.longitude);

	                var geocoder = new google.maps.Geocoder();
	                geocoder.geocode({ 'latLng': coordinates }, function (results, status) {

		    			if (status == google.maps.GeocoderStatus.OK) {

			                that.lat = results[0].geometry.location.lat();
			                that.lon = results[0].geometry.location.lng(); 
		                	for(var i = 0; i < results[0].address_components.length; i++) {
		                		if(results[0].address_components[i].types[0] == 'locality') {
			                        that.city = results[0].address_components[i].short_name;  
			                       	localStorageService.set('curr-city', that.city);  
			                    }
				                if(results[0].address_components[i].types[0] == 'administrative_area_level_2') {
			                        that.city = results[0].address_components[i].short_name;   
			                       	localStorageService.set('curr-city', that.city);  
			                    }
			                    if(results[0].address_components[i].types[0] == 'administrative_area_level_1') {
			                        that.state = results[0].address_components[i].short_name;  
			                        localStorageService.set('curr-state', that.state);   
			                    }
			                    if(results[0].address_components[i].types[0] == 'postal_code') {
			                        that.zip = results[0].address_components[i].short_name;  
			             			localStorageService.set('curr-zip', that.zip);     
			                    }
			                    that.address = results[0].formatted_address;
 			             		localStorageService.set('curr-address', that.address);     
			                }
		    			}

		    			endCallback()

		    		})
				}, function(error){
					startCallback();
	                var code = error.code;
	                var message = '';
	                $('.loading-overlay').removeClass('active');

	                switch(error.code) {
	                    // User did not share geolocation data
	                    case error.PERMISSION_DENIED:
  	                    	window.alert('We don\'t have permission to access your location. Please provide access or use search option.');
	                        break;

	                    // Could not detect current position
	                    case error.POSITION_UNAVAILABLE:
	                    	$window.alert('Can\'t locate your location. Please use the search option.');
	                    	console.log(error);
	                        break;

	                    // Timeout
	                    case error.TIMEOUT:
	               	        window.alert('Please try again.');
	                        break;
	                    default:
	                    	console.log(error);
	                    	endCallback()
	                }

	            }, opts)	
    		}
    		else {
    			alert('your browser doesnt support geolocation');
    		}
    		
        }

        this.getSearchLocation = function(address,callback,errcallback) {
			var geocoder = new google.maps.Geocoder();
			var return_data = {
				address: address
			};

			geocoder.geocode( {'address': address}, function(results, status) {
    			if (status == google.maps.GeocoderStatus.OK) {

	                return_data.lat = results[0].geometry.location.lat();
	                return_data.lon = results[0].geometry.location.lng(); 

                	for(var i = 0; i < results[0].address_components.length; i++) {
                		if(results[0].address_components[i].types[0] == 'locality') {
	                        return_data.city = results[0].address_components[i].short_name;    
	                    }
		                if(results[0].address_components[i].types[0] == 'administrative_area_level_2') {
	                        return_data.city = results[0].address_components[i].short_name;    
	                    }
	                    if(results[0].address_components[i].types[0] == 'administrative_area_level_1') {
	                        return_data.state = results[0].address_components[i].short_name;    
	                    }
	                    if(results[0].address_components[i].types[0] == 'postal_code') {
	                        return_data.zip = results[0].address_components[i].short_name;    
	                    }
	                }
	                callback(return_data)
    			}
    			else {
    				errcallback();
    			}
    			
    		})
        }

        this.getMap = function(lat,lon) {
			var latlng 		= new google.maps.LatLng(parseFloat(lat),parseFloat(lon));
			var mapOptions 	= { 
				zoom: 13, 
				center: latlng ,
				styles : that.MAPS_CONFIG['blue'] 
			};
        	var map  = new google.maps.Map(document.getElementById('map-color-scheme'), mapOptions);
        	return map
        }

        this.loadMapMarker = function(lat,lon,content) {
        	var map    = this.getMap(lat,lon);
        	var latlng = new google.maps.LatLng(parseFloat(lat),parseFloat(lon));
        	var marker = new google.maps.Marker({ 
				position 	: latlng,
				map 		: map,      
				title 		: content.name,
				animation 	: google.maps.Animation.BOUNCE,
			});
			return {
				map: map,
				marker: marker
			}
        }


        this.loadSurroundingMarkers = function(map,contents) {

	        var infoWindowContent = [];
	        var markers = [];
	        var contents_data = contents;


	        // Display multiple markers on a map
	        var infoWindow = new google.maps.InfoWindow(), marker, i;

	        for(var i = 0,length = contents_data.length; i < length; i++) {
	            if(contents_data[i].location_id === null) { continue; }
	            markers.push([contents_data[i].name,contents_data[i].location_id.loc[1], contents_data[i].location_id.loc[0]]);
	            var html = '<div class="info_content" style="width: 290px; font-size:12px">'+
	                            '<strong>' + contents_data[i].name + '</strong>' +
	                            '<br/><strong><a style="color:#438BD7" href="/#/item/' + contents_data[i]._id + '">More details</a></strong>' +
	                            '<br />' + contents_data[i].distance  + ' miles away.' +
	                            '<br />updated on ' + contents_data[i].updatedDate  +
	                            '<br />' + contents_data[i].description  +
	                        '</div>'
	            infoWindowContent.push([html]);
	        }

	        // Display a map on the page
			map.setTilt(45);

	        // in case markers same position
	        for( var f = 0; f < markers.length; f++ ) {
	            for( var u = 0; u < markers.length; u++ ) {
	                if(parseFloat(markers[f][1]) == parseFloat(markers[u][1]) && parseFloat(markers[f][2]) == parseFloat(markers[u][2])) {
	                    markers[f][1] = markers[f][1] + (Math.random() * 1/20);
	                    markers[f][2] = markers[f][2] + (Math.random() * 1/20);
	                }
	            }
	        }

	        for( var j = 0; j < markers.length; j++ ) {
	            var position = new google.maps.LatLng(markers[j][1], markers[j][2]);
	            marker = new google.maps.Marker({
	                position: position,
	                map: map,
	                title: markers[j][0]
	            });
	            
	            // Allow each marker to have an info window    
	            google.maps.event.addListener(marker, 'click', (function(marker, j) {
	                return function() {
	                    infoWindow.setContent(infoWindowContent[j][0]);
	                    infoWindow.open(map, marker);
	                }
	            })(marker, j));
	            if(j === markers.length - 1) {
					google.maps.event.trigger(marker, 'click');
				}
	        }

	    }


  	};

}



	


