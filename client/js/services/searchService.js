'use strict';

module.exports =  function($http,$route,geoService,contentService,navService) {
  	var searchService = function() {

  		var that = this;

	    this.availableSearchParams = null;

	    this.skip  		= 0;
		this.limit 		= 10;
		this.jobtitle 	= '';
		this.address 	= geoService.address;
		this.lat 		= '';
		this.lon 		= '';
		this.city 		= '';
		this.state 		= '';

		this.search 	= false;

	    this.searchParams = {

	    }

	    this.getSearchResult = function() {

	    	$('.loading-overlay').addClass('active');

	    	geoService.getSearchLocation(this.address,function(data) {

	    		that.lat = data.lat;
	    		that.lon = data.lon;

	    		contentService.load({
		            limit   : that.limit,
		            skip    : that.skip,
		            lat     : that.lat,
		            lon     : that.lon,
		            jobtitle: that.jobtitle
		        },function(contents){

		            geoService.lat 			= that.lat;
		            geoService.lon 			= that.lon;
		            geoService.city 		= data.city;
		            geoService.state 		= data.state;       

		            contentService.contents = [];
		            that.search = true;
		            if(navService.view === 'wall') {
		            	that.skip = 0;
		            	$route.reload();
		            	$('.loading-overlay').removeClass('active');
						navService.toWall();
	    			}
		            if(navService.view === 'map') {
		            	that.skip = 0;
		            	$('.loading-overlay').removeClass('active');
	    				navService.toMap();
	    			}
		        	
		        })

	    	},function(err){
	    		console.log(err);
	    	})
	    	
	    }



  	};

  	return new searchService()

}