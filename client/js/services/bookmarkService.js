'use strict';

module.exports = function($http, $location, contentFactory, localStorageService) {

	return new function() {

		var that = this;

		this.contents = [];

		this.load = function() {
			var lsKeys = localStorageService.keys();
	    	_.each(lsKeys,function(lsKey){
	      		if(lsKey.indexOf('bookmark') == 0) {
	        		that.contents.push( localStorageService.get(lsKey) );
	      		}
	    	})
		}

		this.checkBookmark = function() {
	        var check = false;
	        var lsKeys = localStorageService.keys();
	        _.each(lsKeys,function(lsKey){
	            if(lsKey.indexOf('bookmark') == 0) {
	                check = true;
	            }
	        })
	        return check
	    }

		this.bookmark = function(item) {
    	    localStorageService.set('bookmark-' + item._id, item);
    	    if(typeof(item.checkIfBookmarked) === 'undefined') {
    	    	item.bookmark = true;
    	    }
    	    else {
	        	item.checkIfBookmarked();
	    	}
		}

		this.removeBookmark = function(item) {
	  		localStorageService.remove('bookmark-' + item._id);
	  		this.contents = _.without(this.contents, _.findWhere(this.contents, {_id: item._id}));
	  	}


	}

}
