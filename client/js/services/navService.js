'use strict';

module.exports =  function($http, $location, $route, $window) {

	return new function() {

		this.view = 'wall';

		this.toItem = function (item) {
    		if(item.content_type == 'timeline') {
		       	$location.path("/snappyapply/"+item._id);
		    }
		    else {
		    	$location.path("/item/"+item._id);
		    }
  		}

  		this.toSnappyApply = function (item) {
			if(item.crawl === true) {
    			window.open(item.url);
    		}
    		else {
    			$location.path("/snappyapply/" + item._id);
    		}
	    }

	    this.toSnappyPost = function (item) {
    		$location.path("/snappypost");
	    }

	    this.toWall = function() {
	    	this.view = 'wall';
	        $location.path("/wall");
	    }

	    this.toMap = function() {
	    	this.view = 'map';
	        $location.path("/map/");
	    }

	    this.toBookmark = function() {
	    	$location.path("/bookmark");
	    }

	    this.reloadHomePage = function() {
	    	//$location.path("/");
			//$window.location.reload();
			window.location.href = window.location.origin;
	    }

	    this.toSearch = function() {
	    	$location.path('/search')
	    }

	}

}
