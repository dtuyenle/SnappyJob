'use strict';

module.exports =  function($http,localStorageService) {
  	var wallService = function() {

	    this.contents 		= [];
	    this.bad_contents 	= [];
	    this.total 			= 1;
	    this.skip  			= 0;
		this.limit 			= 10;
		this.address 		= '';
		this.lat 			= typeof(localStorageService.get('curr-lat')) 	!== 'undefined' ? localStorageService.get('curr-lat') ? localStorageService.get('curr-lat') : "" : "";
		this.lon 			= typeof(localStorageService.get('curr-lat')) 	!== 'undefined' ? localStorageService.get('curr-lon') ? localStorageService.get('curr-lon') : "" : "";
		this.city 			= typeof(localStorageService.get('curr-city')) 	!== 'undefined' ? localStorageService.get('curr-city') ? localStorageService.get('curr-city') : "" : "";
		this.state 			= typeof(localStorageService.get('curr-state')) !== 'undefined' ? localStorageService.get('curr-state') ? localStorageService.get('curr-state') : "" : "";		
		this.jobtitle 		= '';
		this.view 			= 'list';
		this.busy 			= false;

		this.nextPage = function(params,callback) {

	  		if (this.busy || this.contents.length + this.bad_contents.length === this.total || this.contents.length + this.bad_contents.length > this.total) return;
		    this.busy = true;

		    var that = this;

	  		if (typeof(params) !== 'undefined' && params !== null) { 

	  			this.resetParams();

				if(typeof(params.query) !== 'undefined') {
					var query = params.query.split(',');
					this.jobtitle = query[0];
					this.address = typeof(query[1]) === 'undefined' ? '' : query[1];
				}
				else {
					this.address 	= typeof(params.address) === 'undefined' ? '' : params.address;
					this.jobtitle 	= typeof(params.jobtitle) === 'undefined' ? '' : params.jobtitle;			
				}


				var geocoder = new google.maps.Geocoder();

				geocoder.geocode( { 'address': that.address}, function(results, status) {

	    			if (status == google.maps.GeocoderStatus.OK) {
	    				that.lat = results[0].geometry.location.lat();
	    				that.lon = results[0].geometry.location.lng();
	    				that.getNextPage(callback);
	    			}
	    			else {
	    				that.getNextPage(callback);
	    			}
	    		})
	  		}
	  		else {
	  			this.getNextPage(callback);
	  		}
		}

		this.getNextPage = function(callback) {
			$('.loading-overlay').addClass('active');
			var that = this;
			$http({
				url: "/locations",
				method: 'GET',
				params: {
					limit 	: that.limit,
					skip 	: that.skip,
					lat 	: that.lat,
					lon 	: that.lon,
					jobtitle: that.jobtitle
				}
			}).success(function(data, status, headers, config) {
				
				that.total = data.total;
				data = data.locations;

				for (var i = 0; i < data.length; i++) {

					if(data[i].content_id === null) { that.bad_contents.push(data[i].content_id); continue; }

					if(data[i].content_id.content_type.indexOf('groovejob') == -1 && data[i].content_id.content_type.indexOf('timeline') == -1 && data[i].content_id.content_type.indexOf('shiftgig') == -1) {
						if( jQuery(String(data[i].content_id.description)).length === 0 ) {
							var desc = String(data[i].content_id.description);
						}
						else {
							var desc = jQuery(String(data[i].content_id.description));
							desc.find('style').empty();
							desc = desc.html();
						}
					}
					else {
						var desc = String(data[i].content_id.description);
					}
					var remove_string = 'Care.com provides a trusted place for families and care providers to easily connect, share caregiving experiences, and get advice. The company addresses the unique lifecycle of care needs that each family may go through - including child care, special needs care, tutoring, senior care, pet care, housekeeping and more. The service enables families to find and select the best care possible based on detailed profiles, background checks, and references for hundreds of thousands of mom-reviewed providers who are seeking to share their services.';

					data[i].content_id.budget 			= data[i].content_id.budget == null ? undefined : data[i].content_id.budget;
					data[i].content_id.description 		= desc.replace(/<[^>]+>/gm, '').replace(remove_string,'').split(/\s+/).slice(1,60).join(" ") + ' ...';
		        	data[i].content_id.publishedDate 	= moment(new Date(data[i].content_id.publishedDate)).format('LL');
		        	data[i].content_id.updatedDate 		= moment(new Date(data[i].content_id.updatedDate)).format('LL');
		    		data[i].content_id.diffDate 		= parseInt(moment(new Date()).diff(moment(new Date(data[i].content_id.publishedDate)), 'days'));
					data[i].content_id.diffDate   		= data[i].content_id.diffDate == 0 ? 'today' : data[i].content_id.diffDate;
		    		data[i].content_id.distance 		= that.getDistance(data[i]);
		    		data[i].content_id.gasmoney 		= that.calGasMoney(data[i].content_id.distance);

		        	that.contents.push(data[i].content_id);
		      	}
				that.skip  = that.skip + 10;
				that.busy  = false;

				that.checkIfBookmarked();
				if(typeof(callback) !== 'undefined') {
					callback();
				}
    			$('.loading-overlay').removeClass('active');

			}).error(function(data, status, headers, config) {
				console.log(data);
    			$('.loading-overlay').removeClass('active');
			});
  		}

  		this.getItem = function(id,callback) {
  			this.contents = [];
  			var that = this;
			$http({
				url: "/contents/" + id,
				method: 'GET',
				//params: {}
			}).success(function(data, status, headers, config) {

				if(data.content.content_type.indexOf('groovejob') == -1 && data.content.content_type.indexOf('timeline') == -1) {

					var desc = jQuery(String(data.content.description));
					if(desc.html()) {
						desc.find('style').remove();
						desc.find('br').remove();
						desc = desc.html();
					}
					else {
						desc = String(data.content.description);
					}

				}
				else {
					desc = String(data.content.description);
				}

				data.content.budget 			 = data.content.budget == null ? undefined : data.content.budget;
				data.content.description 		 = desc;
		    	data.content.publishedDate 		 = moment(new Date(data.content.publishedDate)).format('LL');
		    	data.content.updatedDate 		 = moment(new Date(data.content.updatedDate)).format('LL');
		    	data.content.diffDate 			 = parseInt(moment(new Date()).diff(moment(new Date(data.content.publishedDate)), 'days'));
		    	data.content.diffDate 			 = data.content.diffDate == 0 ? 'today' : data.content.diffDate;
		    	data.content.distance 			 = that.getDistance(data.content);
		    	data.content.gasmoney 			 = that.calGasMoney(data.content.distance);

		    	callback(data.content);

		    	that.contents.push(data.content);
		    	
		    	that.checkIfBookmarked();

			}).error(function(data, status, headers, config) {
				console.log(data);
			});

  		}

  		this.checkIfBookmarked = function() {
  			var lsKeys = localStorageService.keys();

  			for(var i = 0,length = this.contents.length; i < length; i++) {
  				this.contents[i]['bookmark'] = false;	
	  			for(var j = 0,lengthj = lsKeys.length; j < lengthj; j++) {
  					if(this.contents[i]._id === lsKeys[j].replace('bookmark-','')) {
  						this.contents[i].bookmark = true;
  					}
  				}
  			}
  		}

  		this.getDistance = function(data) {

  			var loc = typeof(data.loc) !== 'undefined' ? data.loc : data.location_id !== null ? data.location_id.loc : [0,0];
  			if(loc[0] !== 0 && loc[1] !== 0) {
        		if(this.lat === '' && this.lon === '') {
        			return'';
        		}
        		else {
        			return this.calDistance(this.lat,this.lon,loc[1],loc[0]);
        		}
        	}
        	else {
        		return 'Work anywhere';
        	}
  		}

  		this.resetParams = function() {
			this.contents 		= [];
		    this.skip  			= 0;
			this.limit 			= 10;
			this.address 		= '';
			//this.lat 			= '';
			//this.lon 			= '';
			this.jobtitle 		= '';
		}


		this.calDistance = function(latitude_start,longitude_start, latitude_end,longitude_end) {
		    var start = new google.maps.LatLng(parseFloat(latitude_start), parseFloat(longitude_start));
		    var end = new google.maps.LatLng(parseFloat(latitude_end), parseFloat(longitude_end));
		    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(start, end) * 0.621371 / 1000);
	  	}

	  	this.calGasMoney = function(distance) {
	  		return Math.round(distance * 15 / 100)
	  	}

  	}


  	return new wallService();

}