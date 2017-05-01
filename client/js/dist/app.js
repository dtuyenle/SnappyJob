(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var angular = require('angular');

var snappyjob = angular.module('snappyjob',[
    'ngRoute','ngSanitize','infinite-scroll',
    'angular-advanced-searchbox','LocalStorageModule','angularFileUpload',
    'ui.bootstrap.datetimepicker','sticky'
]);


require('angular-vendor');

require('./controllers');
require('./directives');
require('./services');

snappyjob.config(function($routeProvider,$locationProvider){

    // route
    $routeProvider

    .when('/wall',{
        templateUrl: '/partials/wall.html',
        controller: 'wallController'
    })

    .when('/item/:content_id',{
        templateUrl: '/partials/item.html',
        controller: 'itemController'
    })

    .when('/map',{
        templateUrl: '/partials/map.html',
        controller: 'mapController'
    })

    .when('/snappypost',{
        templateUrl: '/partials/snappypost.html',
        controller: 'snappypostController'
    })

    .when('/bookmark',{
        templateUrl: '/partials/bookmark.html',
        controller: 'bookmarkController'
    })

    .when('/snappyapply/:content_id',{
        templateUrl: '/partials/snappyapply.html',
        controller: 'snappyapplyController'
    })

    .when('/', {
        templateUrl: '/partials/search.html',
        controller: 'searchController'
    })

    .otherwise({
        redirectTo: '/'
    });

    /*

    .when('/',{
        templateUrl: '/partials/index.html',
        controller: 'indexController'
    })

    .when('/post',{
        templateUrl: '/partials/post.html',
        controller: 'postController'
    })

    .when('/apply/:content_id',{
        templateUrl: '/partials/apply.html',
        controller: 'applyController'
    })

    .when('/twitterwall',{
        templateUrl: '/partials/twitter.html',
        controller: 'twitterController'
    })

    .when('/snappypost',{
        templateUrl: '/partials/snappypost.html',
        controller: 'snappypostController'
    })
    */

    // use the HTML5 History API
    //$locationProvider.html5Mode(true);

})  
    
snappyjob.run(function($rootScope) {  
    angular.element(document).on("click", function(e) {
        $rootScope.$broadcast("documentClicked", angular.element(e.target));
    });
    $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
        window.scrollTo(0, 0);
    });
});



snappyjob.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('snappyjob');
});

},{"./controllers":6,"./directives":18,"./services":24,"angular":42,"angular-vendor":47}],2:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope, $routeParams, $http, $location, 
    searchService, localStorageService
){

    $('.loading-overlay').removeClass('active');

	$scope.content_id 	= $routeParams.content_id;

    $scope.success = {};

	$scope.errors = [];
	$scope.email  = '';
	$scope.title  = '';
	$scope.body   = '';


	var validation = function() {
        if(!$scope.email.length ||
            !$scope.title.length ||
            !$scope.body.length
        ) 
        {
            return false
        }
        else {
            return true
        }
    }

    $scope.toItem = function(id) {
        $location.path("/item/" + $scope.content_id);
    }

    $scope.toWall = function() {
        $scope.success = {};
        $location.path("/wall");
    }

    $scope.submit = function(){

        $('.loading-overlay').addClass('active');

        $scope.applyDate= (new Date()).toString();

        // validation
        if(!validation()) { return false }

        $http({
            url: "/apply",
            method: 'POST',
            data: {
                content_id  : $scope.content_id,
                title		: $scope.title,
                body 		: $scope.body,
                email 		: $scope.email,
                applyDate 	: $scope.applyDate
            }
        }).success(function(data, status, headers, config) {

            $scope.success = data;
            $scope.success.content_url = window.location.protocol + '//' + window.location.host + window.location.pathname + '#/item/' + $scope.content_id;
            $('.loading-overlay').removeClass('active');
            $scope.$apply();

        }).error(function(data, status, headers, config) {
            $scope.errors['apply error'] = data;
            $('.loading-overlay').removeClass('active');
        });
    
    }
	
}
},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(
	$scope,$location,searchService, 
	bookmarkService, navService
){

	$scope.bookmarkService = bookmarkService;
	$scope.navService      = navService;
	$scope.searchService   = searchService;

	$scope.bookmarkService.load();

}
},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope,$location, $http,
    searchService,localStorageService
){

	$scope.submit = function(){

        $('.loading-overlay').addClass('active');

        var name 		= $('#contactFormName').val();
        var email 		= $('#contactFormEmail').val();
        var address 	= $('#contactFormAddress').val();
        var description = $('#contactFormContent').val();

        $http({
            url: "/contactus",
            method: 'POST',
            data: {
                name  		: name,
                email		: email,
                address 	: address,
                description : description,
            }
        }).success(function(data, status, headers, config) {

        	$('#contact-us').html('Your information is submitted. Thank you so much, we will get back to you as soon as possible.')
            $('.loading-overlay').removeClass('active');

        }).error(function(data, status, headers, config) {
        	console.log(data);
            $('.loading-overlay').removeClass('active');
        });
    
    }


}


                    			
},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope,$location, 
    searchService,localStorageService, geoService, 
    bookmarkService, navService, contentService
) {

	$scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.contentService       = contentService;
    $scope.navService           = navService;
    $scope.localStorageService  = localStorageService;
    $scope.bookmarkService      = bookmarkService;


    $scope.availableSearchParams = [
        { key: "address", name: "Adress", placeholder: "Address..." },
        { key: "jobtitle", name: "Job Title", placeholder: "Job Title..." }
    ];

    $scope.searchService.availableSearchParams = $scope.availableSearchParams;
  	$scope.searchParams = {};
	$scope.searchParams = searchService.searchParams; 	  

 	$scope.$on('$routeChangeUpdate', function(){
    	$scope.searchParams = {};
    	$scope.searchParams = searchService.searchParams; 		
 	});
 	$scope.$on('$routeChangeSuccess', function(){
    	$scope.searchParams = {};
    	$scope.searchParams = searchService.searchParams; 		
 	});

    // on click remove cavas
    jQuery('.uk-nav-offcanvas a').each(function(){
        jQuery(this).on('click', function() {
            jQuery('#offcanvasMain').click();
        })
    })


    $scope.getCurrentLocation = function() {
        $scope.geoService.loadCurrentLocation(function(){
            $('.loading-overlay').addClass('active');
        }, function(){
            $scope.contentService.load({
                limit   : searchService.limit,
                skip    : searchService.skip,
                lat     : geoService.lat,
                lon     : geoService.lon,
                jobtitle: searchService.jobtitle
            },function(contents){
                $('.loading-overlay').removeClass('active');
                navService.toWall();
            })
        })
    }

}
},{}],6:[function(require,module,exports){
'use strict';

var app = require('angular').module('snappyjob');

app.controller('applyController', require('./applyController'));
app.controller('bookmarkController', require('./bookmarkController'));
app.controller('footerController', require('./footerController'));
app.controller('headerController', require('./headerController'));
app.controller('indexController', require('./indexController'));
app.controller('itemController', require('./itemController'));
app.controller('mapController', require('./mapController'));
app.controller('postController', require('./postController'));
app.controller('searchController', require('./searchController'));
app.controller('snappyapplyController', require('./snappyapplyController'));
app.controller('snappypostController', require('./snappypostController'));
app.controller('twitterController', require('./twitterController'));
app.controller('wallController', require('./wallController'));

},{"./applyController":2,"./bookmarkController":3,"./footerController":4,"./headerController":5,"./indexController":7,"./itemController":8,"./mapController":9,"./postController":10,"./searchController":11,"./snappyapplyController":12,"./snappypostController":13,"./twitterController":14,"./wallController":15,"angular":42}],7:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope, 
    searchService,
    tipsService
) {

	// search param
	$scope.searchService = searchService;
	$scope.tipsService = tipsService;
	$scope.tips = [];

	$scope.tipsService.get(20, 1, function(tips){
		$scope.tips = tips;
	})

}
},{}],8:[function(require,module,exports){
'use strict';

module.exports = function(
	$scope,$http,$location,$sce,$routeParams,
    searchService,geoService,contentFactory,bookmarkService,
    filterService,navService,$window,tipsService
) {


	$scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.filterService        = filterService;
    $scope.navService           = navService;
    $scope.bookmarkService 		= bookmarkService;

    $scope.content = new contentFactory();
    $scope.content.content._id = $routeParams.content_id;

    $scope.lat = 0;
    $scope.lon = 0;
    $scope.nearByJobs = [];
    $scope.map = null;
    $scope.marker = null;
    $scope.tipsService = tipsService;
    $scope.inspiration = [];

    // load item data
    $scope.content.get(function(content){

	    $scope.lat = parseFloat($scope.content.content.location_id.loc[1]);
	    $scope.lon = parseFloat($scope.content.content.location_id.loc[0]);

	    $scope.content = content;
		$scope.content.url_iframe = 'https://www.snappyjob.net/iframe?iframe=' + encodeURIComponent($scope.content.url);
		$sce.trustAsResourceUrl($scope.content.url_iframe);
		var mapmarker  = geoService.loadMapMarker($scope.lat,$scope.lon, content);
		$scope.map = mapmarker.map;
		$scope.marker = mapmarker.marker;

	 	// load nearby data
	    $scope.filterService.getNearBy($scope.lat,$scope.lon,function(contents){
	        _.each(contents, function(content) {
	        	$scope.nearByJobs.push(content.content);
	        })
			geoService.loadSurroundingMarkers($scope.map,$scope.nearByJobs);
	    })
    }, function(err) {
		$scope.navService.toWall();
		$window.location.reload();
    })

    $scope.tipsService.get(20, 1, function(tips){
        var random = Math.floor(Math.random() * tips.tips.length);
        $scope.inspiration.push(tips.tips[random]);
        var random = Math.floor(Math.random() * tips.tips.length);
  		$scope.inspiration.push(tips.tips[random]);
        setTimeout(function(){
            var wookmark;
            // Init lightbox
            $('#wookmark').magnificPopup({
                delegate: 'li:not(.inactive) a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });

            // Call the layout function after all images have loaded
            imagesLoaded('#wookmark', function () {
                wookmark = new Wookmark('#wookmark', {
                    offset: 2, // Optional, the distance between grid items
                    itemWidth: 210 // Optional, the width of a grid item
                });
            });

            // some description details weirdo
    		$('.auxColPad').hide();
        }, 2000)
    })
	

}



},{}],9:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope,$http,$route,$location,$sce,
    searchService,geoService,contentService,bookmarkService,
    filterService,navService,twitterService,localStorageService
) {
    

    $scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.contentService       = contentService;
    $scope.filterService        = filterService;
    $scope.navService           = navService;
    $scope.bookmarkService      = bookmarkService;
    $scope.twitterService       = twitterService;
    $scope.localStorageService  = localStorageService;
    
    navService.view = 'map';
    searchService.skip = 0;

    $scope.contents = [];
    $scope.map      = null;
    $scope.prev     = false;
    $scope.next     = true;


    $scope.nextPage = function() {
        if ( $scope.contentService.contents.length + $scope.contentService.bad_contents.length === $scope.contentService.total || 
            $scope.contentService.contents.length + $scope.contentService.bad_contents.length > $scope.contentService.total) {
            return;
        }

        $scope.contentService.load({
            limit   : 40,
            skip    : searchService.skip,
            lat     : geoService.lat,
            lon     : geoService.lon,
            jobtitle: searchService.jobtitle
        },function(contents){
            if(searchService.search == true) {$('.search-close').click(); searchService.search = false; }
            _.each(contents,function(content){
                $scope.contents.push(content.content);
            })
            searchService.skip = searchService.skip + 40;
        })
    }


    $scope.toNext = function() {
        $scope.contentService.contents = [];
        searchService.skip = searchService.skip + 40;
        searchService.limit = 15;

        searchService.skip = searchService.skip > $scope.contentService.total ? $scope.contentService.total : searchService.skip;
        $scope.loadMapMarkers();
    }

    $scope.toPrev = function() {
        $scope.contentService.contents = [];
        searchService.skip = searchService.skip - 40;
        searchService.limit = 15;

        searchService.skip = searchService.skip < 0 ? 0 : searchService.skip;
        $scope.loadMapMarkers();
    }

    $scope.loadMapMarkers = function() {
        $scope.contentService.load({
            limit   : 40,
            skip    : searchService.skip,
            lat     : geoService.lat,
            lon     : geoService.lon,
            jobtitle: searchService.jobtitle
        },function(contents){
            $scope.contents = [];
            _.each(contents,function(content){
                $scope.contents.push(content.content);
            })

            if($scope.contents.length > 0) {
                $scope.map  = geoService.getMap($scope.contents[0].location_id.loc[1],$scope.contents[0].location_id.loc[0]);
                geoService.loadSurroundingMarkers($scope.map,$scope.contents);
                setTimeout(function(){
                    google.maps.event.trigger($scope.map, 'resize');
                },1000)
            }

            if(searchService.skip > 0) {
                $scope.prev = true;
            }
            else {
                $scope.prev = false;
            }

        })

    }

}
},{}],10:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope, $http, $timeout, $location, 
    localStorageService
){
    
    $('.loading-overlay').removeClass('active');

    // errors
    $scope.errors = {};

    // success
    $scope.success = {};

    // state dropdown
	$scope.states = [{"name": "Alabama","abbreviation": "AL"},{"name": "Alaska","abbreviation": "AK"},{"name": "American Samoa","abbreviation": "AS"},{"name": "Arizona","abbreviation": "AZ"},{"name": "Arkansas","abbreviation": "AR"},{"name": "California","abbreviation": "CA"},{"name": "Colorado","abbreviation": "CO"},{"name": "Connecticut","abbreviation": "CT"},{"name": "Delaware","abbreviation": "DE"},{"name": "District Of Columbia","abbreviation": "DC"},{"name": "Federated States Of Micronesia","abbreviation": "FM"},{"name": "Florida","abbreviation": "FL"},{"name": "Georgia","abbreviation": "GA"},{"name": "Guam","abbreviation": "GU"},{"name": "Hawaii","abbreviation": "HI"},{"name": "Idaho","abbreviation": "ID"},{"name": "Illinois","abbreviation": "IL"},{"name": "Indiana","abbreviation": "IN"},{"name": "Iowa","abbreviation": "IA"},{"name": "Kansas","abbreviation": "KS"},{"name": "Kentucky","abbreviation": "KY"},{"name": "Louisiana","abbreviation": "LA"},{"name": "Maine","abbreviation": "ME"},{"name": "Marshall Islands","abbreviation": "MH"},{"name": "Maryland","abbreviation": "MD"},{"name": "Massachusetts","abbreviation": "MA"},{"name": "Michigan","abbreviation": "MI"},{"name": "Minnesota","abbreviation": "MN"},{"name": "Mississippi","abbreviation": "MS"},{"name": "Missouri","abbreviation": "MO"},{"name": "Montana","abbreviation": "MT"},{"name": "Nebraska","abbreviation": "NE"},{"name": "Nevada","abbreviation": "NV"},{"name": "New Hampshire","abbreviation": "NH"},{"name": "New Jersey","abbreviation": "NJ"},{"name": "New Mexico","abbreviation": "NM"},{"name": "New York","abbreviation": "NY"},{"name": "North Carolina","abbreviation": "NC"},{"name": "North Dakota","abbreviation": "ND"},{"name": "Northern Mariana Islands","abbreviation": "MP"},{"name": "Ohio","abbreviation": "OH"},{"name": "Oklahoma","abbreviation": "OK"},{"name": "Oregon","abbreviation": "OR"},{"name": "Palau","abbreviation": "PW"},{"name": "Pennsylvania","abbreviation": "PA"},{"name": "Puerto Rico","abbreviation": "PR"},{"name": "Rhode Island","abbreviation": "RI"},{"name": "South Carolina","abbreviation": "SC"},{"name": "South Dakota","abbreviation": "SD"},{"name": "Tennessee","abbreviation": "TN"},{"name": "Texas","abbreviation": "TX"},{"name": "Utah","abbreviation": "UT"},{"name": "Vermont","abbreviation": "VT"},{"name": "Virgin Islands","abbreviation": "VI"},{"name": "Virginia","abbreviation": "VA"},{"name": "Washington","abbreviation": "WA"},{"name": "West Virginia","abbreviation": "WV"},{"name": "Wisconsin","abbreviation": "WI"},{"name": "Wyoming","abbreviation": "WY"}];
    $scope.state =  typeof(localStorageService.get('post-state')) !== 'undefined' ? localStorageService.get('post-state') ? localStorageService.get('post-state') : "" : "";
    /*$scope.$watch('state', function() {
        localStorageService.set('post-state', $scope.state);
    },true);*/

    // type dropdown
    $scope.types = [{
        name: "Restaurant",
        slug: "restaurant",
    }, {
        name: "Garden",
        slug: "garden",
    }, {
        name: "IT",
        slug: "it",
    }, {
        name: "Creative",
        slug: "creative",
    }, {
        name: "Housework",
        slug: "housework",
    }, {
        name: "Other",
        slug: "other",
    }];
    $scope.type =  typeof(localStorageService.get('post-type')) !== 'undefined' ? localStorageService.get('post-type') ? localStorageService.get('post-type') : "" : "";
    /*$scope.$watch('type', function() {
        localStorageService.set('post-type', $scope.type);
    },true);*/

    $scope.contact = {
        phone: '',
        email: ''
    }
    $scope.contact = typeof(localStorageService.get('post-contact')) !== 'undefined' ? localStorageService.get('post-contact') ? localStorageService.get('post-contact') : "" : "";;
    /*$scope.$watch('contact', function() {
        localStorageService.set('post-contact', $scope.contact);
    },true);*/

    $scope.location = {
        city: '',
        zip: '',
        loc: {
            lat: 0,
            lon: 0
        },
        state: '',
        address: ''
    }
    $scope.location = typeof(localStorageService.get('post-location')) !== 'undefined' ? localStorageService.get('post-location') : "";;
    /*$scope.$watch('location', function() {
        localStorageService.set('post-location', $scope.location);
    },true);*/

    $scope.content = {
        name: '',
        slug: '',
        content_type: '',
        budget: '',
        url: '',
        crawl: false,
        description: '',
        publishedDate: '',
        updatedDate: ''
    }
    $scope.content = typeof(localStorageService.get('post-content')) !== 'undefined' ? localStorageService.get('post-content') : "";;
    /*$scope.$watch('content', function() {
        localStorageService.set('post-content', $scope.content);
    },true);*/


    $scope.toItem = function(id) {
        $location.path("/item/" + $scope.success.content);
    }

    $scope.toJobPost = function() {
        $scope.success = {};
        $location.path("/post");
    }


    $scope.saveInputs = function() {
        localStorageService.set('post-state', $scope.state);
        localStorageService.set('post-type', $scope.type);
        localStorageService.set('post-contact', $scope.contact);
        localStorageService.set('post-location', $scope.location);
        localStorageService.set('post-content', $scope.content);
    }

    $scope.removeInputs = function() {
        localStorageService.remove('post-state');
        localStorageService.remove('post-type');
        localStorageService.remove('post-contact');
        localStorageService.remove('post-location');
        localStorageService.remove('post-content');
    }


    var validation = function() {
        if(!$scope.contact.email.length ||
            !$scope.location.zip.length ||
            !$scope.location.state.length ||
            !$scope.location.city.length ||
            !$scope.location.state.length ||
            !$scope.content.name.length ||
            !$scope.content.budget.length ||
            !$scope.content.content_type.length ||
            !$scope.content.description.length ||
            !$scope.content.content_type.length
        ) {
            return false
        }
        else {
            return true
        }
    }

    $scope.submit = function(){

        $('.loading-overlay').addClass('active');

        // set data for other variables not ited to view
        $scope.location.state       = $scope.state.name ? $scope.state.name : '';
        $scope.content.content_type = $scope.type.name ? $scope.type.name : '';
        $scope.content.slug         = $scope.content.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        $scope.content.publishedDate= (new Date()).toString();
        $scope.content.updatedDate  = (new Date()).toString();
        if(typeof($scope.location.address) !== 'undefined' ) {
            if($scope.location.address.replace(/ /g,'') === '') {
                $scope.location.address = $scope.location.city + ' ' + $scope.location.state; 
            }
        }
        else {
            $scope.location.address = $scope.location.city + ' ' + $scope.location.state; 
        }

        // validation
        if(!validation()) { return false }

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': $scope.location.address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // remove error
                $scope.errors = {};

                $scope.location.loc = {};
                $scope.location.loc.lat = results[0].geometry.location.lat();
                $scope.location.loc.lon = results[0].geometry.location.lng();
                
                $http({
                    url: "/contents",
                    method: 'POST',
                    data: {
                        contact     : $scope.contact,
                        location    : $scope.location,
                        content     : $scope.content
                    }
                }).success(function(data, status, headers, config) {
                    $('.loading-overlay').removeClass('active');
                    $scope.success = data;
                    $scope.success.content_url = window.location.protocol + '//' + window.location.host + window.location.pathname + '#/item/' + $scope.success.content;
                    //$scope.$apply();
                    console.log(data);
                }).error(function(data, status, headers, config) {
                    $scope.errors['submit'] = data;
                    $('.loading-overlay').removeClass('active');
                    $scope.$apply();
                    console.log(data);
                });
            }
            else {
                $('.loading-overlay').removeClass('active');
                // add error
                $scope.errors['location'] = 'Please make sure you entered correct location.';
                $scope.tab = 3;
                $scope.$apply();
            }
        })
    
    }


}



},{}],11:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope,$location, 
    searchService,localStorageService, geoService, 
    bookmarkService, navService, contentService, tipsService
){

    $scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.contentService       = contentService;
    $scope.navService           = navService;
    $scope.localStorageService  = localStorageService;
    $scope.bookmarkService      = bookmarkService;

    $scope.tipsService = tipsService;
    $scope.tips = [];

    $scope.tipsService.get(40, 1, function(tips){
        $scope.tips = tips.tips;setTimeout(function(){
            var wookmark;
            // Init lightbox
            $('#wookmark').magnificPopup({
                delegate: 'li:not(.inactive) a',
                type: 'image',
                gallery: {
                    enabled: true
                }
            });

            // Call the layout function after all images have loaded
            imagesLoaded('#wookmark', function () {
                wookmark = new Wookmark('#wookmark', {
                    offset: 2, // Optional, the distance between grid items
                    itemWidth: 210 // Optional, the width of a grid item
                });
            });
        }, 2000)
    })
    

    $scope.availableSearchParams = [
        { key: "address", name: "Adress", placeholder: "Address..." },
        { key: "jobtitle", name: "Job Title", placeholder: "Job Title..." }
    ];

    $scope.searchService.availableSearchParams = $scope.availableSearchParams;
    $scope.searchParams = {};
    $scope.searchParams = searchService.searchParams;     

    $scope.$on('$routeChangeUpdate', function(){
        $scope.searchParams = {};
        $scope.searchParams = searchService.searchParams;       
    });
    $scope.$on('$routeChangeSuccess', function(){
        $scope.searchParams = {};
        $scope.searchParams = searchService.searchParams;       
    });

    // on click remove cavas
    jQuery('.uk-nav-offcanvas a').each(function(){
        jQuery(this).on('click', function() {
            jQuery('#offcanvasMain').click();
        })
    })


    $scope.getCurrentLocation = function() {
        $scope.geoService.loadCurrentLocation(function(){
            $('.loading-overlay').addClass('active');
        }, function(){
            $scope.contentService.load({
                limit   : searchService.limit,
                skip    : searchService.skip,
                lat     : geoService.lat,
                lon     : geoService.lon,
                jobtitle: searchService.jobtitle
            },function(contents){
                $('.loading-overlay').removeClass('active');
                navService.toWall();
            })
        })
    }

}
},{}],12:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope, $routeParams, $http, $timeout, $route, $location, 
    localStorageService, contentService, navService, contentFactory, geoService, 
    applyService
) {
    
    $scope.applyService = applyService;
    $scope.navService   = navService;
    $scope.geoService   = geoService;

    $scope.content = new contentFactory();
    $scope.content.content._id = $routeParams.content_id;

    $scope.applyService.apply.content_id = $routeParams.content_id;

    $scope.content.get(function(data){

    });

    $scope.submit = function() {
        $('.loading-overlay').addClass('active');
        $scope.applyService.save(function(){
            $route.reload();
            $('.loading-overlay').removeClass('active');
        },function(){
            alert('There was an error. Please try again!');
            $('.loading-overlay').removeClass('active');
        })
    }


}



},{}],13:[function(require,module,exports){
'use strict';

module.exports = function(
	$scope,$http,$location,$sce,$routeParams,
    searchService,geoService,contentFactory,bookmarkService,
    contactFactory,locationFactory,assetFactory,
    filterService,navService
) {


	$scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.filterService        = filterService;
    $scope.navService           = navService;
    $scope.bookmarkService 		= bookmarkService;


    $scope.content = new contentFactory();
	$scope.content.content.contact_id 	= new contactFactory();
	$scope.content.content.location_id 	= new locationFactory();
	$scope.content.content.asset_id 	= [];
	$scope.assetService = new assetFactory('image',function(data){
		$scope.content.content.asset_id.push(data._id);
	});

	
    $scope.submit = function() {
    	$('.loading-overlay').addClass('active');
    	geoService.getSearchLocation($scope.content.content.location_id.location.address,function(data){
    		$scope.content.content.location_id.location.city = data.city;
    		$scope.content.content.location_id.location.state = data.state;
    		$scope.content.content.location_id.location.address = data.address;
    		$scope.content.content.location_id.location.loc = [data.lon,data.lat];

    		$scope.assetService.save(function(){
    			$scope.content.save(function(data){
    				$('.loading-overlay').removeClass('active');
    				$scope.navService.toSnappyApply($scope.content.content);
    			});
    		});
    	},function(){
    		alert('There was an error. Please try again!');
	        $('.loading-overlay').removeClass('active');
    	})    

    }

}
},{}],14:[function(require,module,exports){
'use strict';

module.exports = function(
	$scope,$http,
	localStorageService
){

	var lat = typeof(localStorageService.get('curr-lat')) !== 'undefined' ? localStorageService.get('curr-lat') ? localStorageService.get('curr-lat') : 0 : 0;
	var lon = typeof(localStorageService.get('curr-lat')) !== 'undefined' ? localStorageService.get('curr-lon') ? localStorageService.get('curr-lon') : 0 : 0;
		
    $('.loading-overlay').addClass('active');


	$http({
		url: "/twitter",
		method: 'GET',
		params:{
			lat: lat,
			lon:lon
		}
	}).success(function(data, status, headers, config) {

		data = data.statuses;
		
		var user, text, img, time, url; 
		var twitters = [];          


		// append tweets into page
		for (var i = 0; i < data.length; i++) {   
					
			img = '';
			url = 'http://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
			try {
				if (data[i].entities['media']) {
					img = '<a href="' + url + '" target="_blank"><img src="' + data[i].entities['media'][0].media_url + '" /></a>';
				}
			} catch (e) {  
				//no media
			}

			user = ify.clean(data[i].text);
			text = ify.clean(data[i].text);
			time = timeAgo(data[i].created_at);
			url  = url

			twitters.push({
				user: user,
				text: text,
				img: img,
				time: time,
				url: url
			})
		}

		$scope.twitters = twitters;
		
		$('.loading-overlay').removeClass('active');
	  

	}).error(function(data, status, headers, config) {
		console.log(data);
	    $('.loading-overlay').removeClass('active');
	});



	// get request param
	function getRequest(options) {
		var request;
		   
	  	// different JSON request {hash|user}
		if (options.search) {
			request = {
				q: options.search,
				count: options.numTweets,
				api: 'search_tweets'
			}
		} else {
			request = {
				q: options.user,
				count: options.numTweets,
				api: 'statuses_userTimeline'
			}
		}
		return request
	}


	/**
	    * relative time calculator FROM TWITTER
        * @param {string} twitter date string returned from Twitter API
        * @return {string} relative time like "2 minutes ago"
    */
	var timeAgo = function(dateString) {

		var rightNow = new Date();
		var then 	 = new Date(dateString);
		
		var diff = rightNow - then;
   
		var second = 1000,
			minute = second * 60,
			hour = minute * 60,
			day = hour * 24,
			week = day * 7;
   
		if (isNaN(diff) || diff < 0) {
			return ""; // return blank string if unknown
		}
   
		if (diff < second * 2) {
			// within 2 seconds
			return "right now";
		}
   
		if (diff < minute) {
			return Math.floor(diff / second) + " seconds ago";
		}
   
		if (diff < minute * 2) {
			return "about 1 minute ago";
		}

		if (diff < hour) {
			return Math.floor(diff / minute) + " minutes ago";
		}
   
		if (diff < hour * 2) {
			return "about 1 hour ago";
		}
   
		if (diff < day) {
			return  Math.floor(diff / hour) + " hours ago";
		}

		if (diff > day && diff < day * 2) {
			return "yesterday";
		}
   
		if (diff < day * 365) {
			return Math.floor(diff / day) + " days ago";
		}
   		else {
			return "over a year ago";
		}
	} // timeAgo()
       
       
	/**
		* The Twitalinkahashifyer!
        * http://www.dustindiaz.com/basement/ify.html
        * Eg:
        * ify.clean('your tweet text');
    */
	var ify =  {
        link: function(tweet) {
			return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
        	    var http = m2.match(/w/) ? 'http://' : '';
            	return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
      		});
    	},
   
        at: function(tweet) {
      		return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
        		return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
      		});
        },
   
        list: function(tweet) {
      		return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
        		return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
      		});
        },
   
        hash: function(tweet) {
      		return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
        		return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
      		});
        },
   
        clean: function(tweet) {
      		return this.hash(this.at(this.list(this.link(tweet))));
        }
	} // ify

}

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function(
    $scope,$http,$location,$sce, $timeout,
    searchService,geoService,contentService,bookmarkService,
    filterService,navService,twitterService,localStorageService,newsService
) {

    $scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.contentService       = contentService;
    $scope.filterService        = filterService;
    $scope.navService           = navService;
    $scope.bookmarkService      = bookmarkService;
    $scope.twitterService       = twitterService;
    $scope.localStorageService  = localStorageService;
    $scope.newsService          = newsService;
    navService.view = 'wall';
    searchService.skip = 0;

    $scope.busy             = false;
    $scope.latest_contents_original = [];
    $scope.latest_contents_page = 1;
    $scope.latest_contents  = [];
    $scope.total_page = 0;
    $scope.contents         = [];
    $scope.start_news = 0;

    $scope.notfound         = false;
    $scope.news_limit = 1;
    $scope.news_offset = 0;

    $scope.nextPage = function() {
        if ($scope.busy || 
            $scope.contentService.contents.length + $scope.contentService.bad_contents.length === $scope.contentService.total || 
            $scope.contentService.contents.length + $scope.contentService.bad_contents.length > $scope.contentService.total) {
            return;
        }
        $scope.busy = true;

        $scope.start_news = $scope.contents.length;

        $scope.contentService.load({
            limit   : searchService.limit,
            skip    : searchService.skip,
            lat     : geoService.lat,
            lon     : geoService.lon,
            jobtitle: searchService.jobtitle
        },function(contents){
            if($scope.contentService.contents.length === 0) { $scope.contents = []; }            
            else {
                if(searchService.search == true) { $('.search-close').click(); searchService.search = false ; }
                _.each(contents,function(content){
                    $scope.contents.push(content.content);
                })
                searchService.skip  = searchService.skip + 10;
                $scope.busy         = false;
            }
            if($scope.contents.length === 0){ $scope.notfound = true; }
            $scope.getNews();
        })
    }


    $scope.addScrollLatestContent = function(){
        $(window).on('scroll',function(){
            if($('twitter-search').length == 0) { return }
            if(parseInt($(this).scrollTop()) < 650) {
                var top = $('#twitter-search').offset().top + $('#twitter-search').height();
                $('.oe-sidebar-nav').css({
                    'zIndex': '-1',
                    'margin-top' : '0px'
                })
            }
            else {
                $('.oe-sidebar-nav').css({
                    'zIndex': '1',
                    'margin-top': '0px'
                })
            }
        })
    }


    $scope.getLatestContents = function() {
        $scope.filterService.getLatest(1000,function(contents){
            _.each(contents,function(content){
                $scope.latest_contents_original.push(content.content);
            })
            $scope.total_page = Math.ceil($scope.latest_contents_original.length / 4) - 1;
            $scope.latest_contents = $scope.latest_contents_original.slice(1,5);
        }) 
    }

    $scope.nextLatestContents = function() {
        if($scope.latest_contents_page === $scope.total_page) { return }
        $scope.latest_contents_page = 1 + $scope.latest_contents_page;
        var start   = $scope.latest_contents_page * 4;
        var stop    = start + 4; 
        $scope.latest_contents = $scope.latest_contents_original.slice(start, stop);
    }

    $scope.prevLatestContents = function() {
        if($scope.latest_contents_page === 1) { return }
        $scope.latest_contents_page = $scope.latest_contents_page - 1;
        var start   = $scope.latest_contents_page * 4;
        var stop    = start + 4; 
        $scope.latest_contents = $scope.latest_contents_original.slice(start, stop);
    }


    $scope.getTwitterWidget = function() {
        $scope.twitterService.get(function(){
            //var $ = function (id) { return document.getElementById(id); };
            function loadTwitter() {
                if (typeof twttr === 'undefined') {
                    (function() {
                        window.twttr = (function (d, s, id) {
                            var t, js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return; js = d.createElement(s); js.id = id;
                            js.src = "//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
                            return window.twttr || (t = { e: [], ready: function (f) { t.e.push(f) } });
                            } (document, "script", "twitter-wjs"));                    

                    })();
                } else {
                    $timeout = twttr.widgets.load();
                };
            }
            //var twitter = $('twitter-wjs');
            //twitter.remove();
            loadTwitter();
        });
    }

    $scope.getNews = function () {
        if($scope.news_offset !== 0) {
            $scope.news_offset = $scope.news_offset + 1;
        }
        else {
            $scope.news_offset = 1;
        }
        var j = 0;
        $scope.newsService.get($scope.news_limit, $scope.news_offset, function(news){
            if(news.news.length === 0) { return; }
            for(var i = $scope.start_news, length = $scope.contents.length; i < length; i++) {
                if(i % 10 == 0 && j < 1 && i !== 0) {
                    $scope.contents.splice(i, 0, news.news[j]);
                    j = j + 1;
                }
            }
        })
    }
    

}

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function($rootScope) {
	return {
		restrict: "E",
		templateUrl: "./../../templates/dropdown.html",
		scope: {
			placeholder: "@",
			list: "=",
			selected: "=",
			property: "@"
		},
		link: function(scope) {
			scope.listVisible = false;
			scope.isPlaceholder = true;

			scope.select = function(item) {
				scope.isPlaceholder = false;
				scope.selected = item;
			};

			scope.isSelected = function(item) {
				return item[scope.property] === scope.selected[scope.property];
			};

			scope.show = function() {
				scope.listVisible = true;
			};

			$rootScope.$on("documentClicked", function(inner, target) {
				console.log($(target[0]).is(".dropdown-display.clicked") || $(target[0]).parents(".dropdown-display.clicked").length > 0);
				if (!$(target[0]).is(".dropdown-display.clicked") && !$(target[0]).parents(".dropdown-display.clicked").length > 0)
					scope.$apply(function() {
						scope.listVisible = false;
					});
			});

			scope.$watch("selected", function(value) {
				scope.isPlaceholder = scope.selected[scope.property] === undefined;
				scope.display = scope.selected[scope.property];
			});
		}
	}
}
},{}],17:[function(require,module,exports){
'use strict';

// Angular File Upload module does not include this directive

/**
* The ng-thumb directive
* @author: nerv
* @version: 0.1.2, 2014-01-09
*/
module.exports = function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}
},{}],18:[function(require,module,exports){
'use strict';

var app = require('angular').module('snappyjob');

app.directive('dropdown', require('./dropdownDirective'));
app.directive('ngThumb', require('./fileuploadDirective'));
app.directive('shareLinks', require('./socialsharingDirective'));
app.directive('onLastRepeat', require('./twitterDirective'));


},{"./dropdownDirective":16,"./fileuploadDirective":17,"./socialsharingDirective":19,"./twitterDirective":20,"angular":42}],19:[function(require,module,exports){
'use strict';

module.exports = function ($location) {
    return {
        link: function (scope, elem, attrs) {
            var i,
            sites = ['twitter', 'facebook', 'linkedin', 'google-plus'],
            theLink,
            links = attrs.shareLinks.toLowerCase().split(','),
            pageLink = encodeURIComponent($location.absUrl()),
            pageTitle = attrs.shareTitle,
            pageTitleUri = encodeURIComponent(pageTitle),
            shareLinks = [],
            square = '';

            elem.addClass('td-easy-social-share');

            // check if square icon specified
            square = (attrs.shareSquare && attrs.shareSquare.toString() === 'true') ? '-square' : '';

            // assign share link for each network
            angular.forEach(links, function (key) {
                key = key.trim();

                switch (key) {
                    case 'twitter':
                        theLink = 'http://twitter.com/intent/tweet?text=' + pageTitleUri + '%20' + pageLink;
                        break;
                    case 'facebook':
                        theLink = 'http://facebook.com/sharer.php?u=' + pageLink;
                        break;
                    case 'linkedin':
                        theLink = 'http://www.linkedin.com/shareArticle?mini=true&url=' + pageLink + '&title=' + pageTitleUri;
                        break;
                    case 'google-plus':
                        theLink = 'https://plus.google.com/share?url=' + pageLink;
                        break;
                }

                if (sites.indexOf(key) > -1) {
                    shareLinks.push({network: key, url: theLink});
                }
            });

            for (i = 0; i < shareLinks.length; i++) {
                var anchor = '';
                //anchor += '<a href="'+ shareLinks[i].url + '"';
                //anchor += ' class="fa fa-'+shareLinks[i].network + square + '" target="_blank"';
                //anchor += '></a>';

                anchor = '<a class="btn btn-default btn-lg oe-social oe-social-transparent" href="'+ shareLinks[i].url + '">' +
                '<i class="fa fa-'+shareLinks[i].network + square + '"></i>' + 
                '</a>'

                elem.append(anchor);
            }
        }
    };
}

},{}],20:[function(require,module,exports){
'use strict';

module.exports = function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
            jQuery('#jstwitter').gridalicious({
                gutter: 13, 
                width: 200, 
                animate: true
            });   
        }, 1);
    };
}

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
				zoom: 12, 
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



	



},{}],24:[function(require,module,exports){
'use strict';

var app = require('angular').module('snappyjob');

app.service('bookmarkService', require('./bookmarkService'));
app.service('filterService', require('./filterService'));
app.service('geoService', require('./geoService'));
app.service('navService', require('./navService'));
app.service('searchService', require('./searchService'));
app.service('wallService', require('./wallService'));


app.service('applyService', require('./models/applyService'));
app.service('assetFactory', require('./models/assetFactory'));
app.service('contactFactory', require('./models/contactFactory'));
app.service('contentFactory', require('./models/contentFactory'));
app.service('contentService', require('./models/contentService'));
app.service('locationFactory', require('./models/locationFactory'));
app.service('tagFactory', require('./models/tagFactory'));
app.service('twitterService', require('./models/twitterService'));
app.service('newsService', require('./models/newsService'));
app.service('tipsService', require('./models/tipsService'));

},{"./bookmarkService":21,"./filterService":22,"./geoService":23,"./models/applyService":25,"./models/assetFactory":26,"./models/contactFactory":27,"./models/contentFactory":28,"./models/contentService":29,"./models/locationFactory":30,"./models/newsService":31,"./models/tagFactory":32,"./models/tipsService":33,"./models/twitterService":34,"./navService":35,"./searchService":36,"./wallService":37,"angular":42}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
'use strict';

module.exports = function($http, FileUploader) {
  	return function(type, startcallback, stopcallback) {

  		var that = this;

        this.uploader   = new FileUploader({
            url: '/asset/' + type,
        });

        this.asset = {};
        this.asset._id        = '';
  		this.asset.path       = '';
  		this.asset.type       = type;
        this.asset.blob_url   = '';
        this.asset.base64_data= '';

  		// Filter
        this.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // Callback --> look into angular-file-upload for more callbacks supported
        this.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            that.asset._id    = response.asset_data._id;
            that.asset.path   = response.asset_data.path;
            that.asset.type   = response.asset_data.type;
            if(startcallback) {
                startcallback(response.asset_data);
            }
        };

        this.save = function(callback) {
            this.uploader.uploadAll();
            this.uploader.onCompleteAll = function() {
                if(callback) {
                    callback();
                }
            };

        }

        this.load = function(data) {
            for(var prop in data) {
                that.content[prop] = data[prop]
            }
            this.content.path = data.path.replace('uploads','');
        }

        this.startRecord = function() {
            Fr.voice.record(false, startcallback());
        }

        this.stopRecord = function() {
            this.loadRecord(function() {
                Fr.voice.stop();
                stopcallback();
            });
        }

        // "URL" "blob" "base64"
        this.loadRecord = function(callback) {
            Fr.voice.export(function(url){
                that.blob_url = url;
                Fr.voice.export(function(base64){
                    that.base64_data = base64;
                    callback();
                }, 'base64');
            }, 'URL');
           
        }

	}

}
},{}],27:[function(require,module,exports){
'use strict';

module.exports = function($http) {
  	return function() {

  		var that = this;

        this.contact = {};
        this.contact.content_id      = '';
        this.contact.email           = '';
        this.contact.phone           = '';


        this.load = function(data) {
            for(var prop in data) {
                that.contact[prop] = data[prop]
            }
        }


	}

}
},{}],28:[function(require,module,exports){
'use strict';

module.exports = function(
    $http, geoService, 
    localStorageService, applyService
) {
  	return function() {

  		var that = this;

        this.content = {};
        this.content._id             = '';
        this.content.slug            = '';
        this.content.name            = '';
        this.content.url             = '';
        this.content.content_type    = '';
        this.content.description     = '';
        this.content.description_details     = '';
        this.content.budget          = '';
        this.content.crawl           = false;
        this.content.location_id     = null;
        this.content.contact_id      = null;
        this.content.tags_id         = null;
        this.content.asset_id        = null;
        this.content.startDate       = '';
        this.content.endDate         = '';
        this.content.publishedDate   = '';
        this.content.updatedDate     = '';

        this.content.diffDate        = '';
        this.content.distance        = '';
        this.content.gasmoney        = '';
        this.content.bookmark        = false;

        this.applies                 = [];


        this.load = function(data) {
            data = this.removeJunk(data);
            for(var prop in data) {
                that.content[prop] = data[prop]
            }

            this.content.budget           = this.content.budget == null ? undefined : this.budget;
            this.content.description      = this.content.description.replace(/<[^>]+>/gm, '').split(/\s+/).slice(1,60).join(" ") + ' ...';
            this.content.description_details = this.content.description_details !== null ? this.content.description_details.replace(/ng-if/g, 'class').replace('container','') : '';
            this.content.publishedDate    = moment(new Date(this.content.publishedDate)).format('LL');
            this.content.updatedDate      = moment(new Date(this.content.updatedDate)).format('LL');
            this.content.diffDate         = parseInt(moment(new Date()).diff(moment(new Date(this.content.publishedDate)), 'days'));
            this.content.diffDate         = this.content.diffDate == 0 || !this.content.diffDate ? 'today' : this.content.diffDate;
            this.content.distance         = this.getDistance(this.content);
            this.content.gasmoney         = this.calGasMoney(this.content.distance);

            this.checkIfBookmarked();
        }

        this.removeJunk = function(data) {

            //if(data.content_type.indexOf('groovejob') == -1 && data.content_type.indexOf('timeline') == -1 && data.content_type.indexOf('shiftgig') == -1) {
                try { 
                    var desc = jQuery(String(data.description));
                    if(desc.length !== 0) {
                        desc.find('style').empty();
                        desc = desc.html();
                        data.description = desc;
                    }
                    else {
                        data.description = String(data.description);   
                    }
                }
                catch(e) {
                    data.description = String(data.description);
                }
                if(typeof(data.description) === 'undefined') {
                    data.description = String(data.description);
                }
            //}
            //else {
            //    var desc = String(data.description);
            //}

            return data
        }

  		this.save = function(callback) {
            this.content.content_type = 'timeline';
  			$http({
                url: "/contents",
                method: 'POST',
                data: {
                    contact     : that.content.contact_id.contact,
                    location    : that.content.location_id.location,
                    content     : that.content
                }
            }).success(function(data, status, headers, config) {
                that.content._id = data.content;
                callback(data);
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
  		}

        this.get = function(callback, callbackErr) {
            $http({
                url: "/contents/" + that.content._id,
                method: 'GET',
            }).success(function(data, status, headers, config) {
                that.load(data.content);
                that.loadApplies(data.applies);
                if(callback) {
                    callback(that.content);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
                callbackErr(data);
            });
        }

        this.loadApplies = function(applies) {
            _.each(applies,function(apply){
                that.applies.push(applyService.getData(apply));
            })
        }

        this.checkIfBookmarked = function() {
            var lsKeys = localStorageService.keys();
            for(var i = 0,length = lsKeys.length; i < length; i++) {
                if(that.content._id === lsKeys[i].replace('bookmark-','')) {
                    that.content.bookmark = true;
                }
            }
        }

        this.getDistance = function() {
            if(this.content.location_id == null) { return 'Work Anywhere'}
            var loc = typeof(this.content.location_id.loc) !== 'undefined' ? this.content.location_id.loc : this.content.location_id !== null ? this.content.location_id.loc : [0,0];
            if(loc[0] !== 0 && loc[1] !== 0) {
                if(geoService.lat === '' && geoService.lon === '') {
                    return null;
                }
                else {
                    return geoService.calDistance(geoService.lat,geoService.lon,loc[1],loc[0]);
                }
            }
            else {
                return 'Work anywhere';
            }
        }

        this.calGasMoney = function(distance) {
            return Math.round(distance * 15 / 100)
        }


	}

}
},{}],29:[function(require,module,exports){
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


},{}],30:[function(require,module,exports){
'use strict';

module.exports = function($http, $q) {
  	return function() {

  		var that = this;

        this.location = {};
        this.location.content_id      = '';
        this.location.address         = '';
        this.location.city            = '';
        this.location.state           = '';
        this.location.zip             = '';
        this.location.loc             = []; // lng lat


        this.load = function(data) {
            for(var prop in data) {
                that[prop] = data[prop]
            }
        }

	}

}
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
'use strict';

module.exports = function($http) {
  	return function() {

  		var that = this;

        this.tag = {};
        this.tag.content_id    = '';
        this.tag.tag           = '';


        this.load = function(data) {
            for(var prop in data) {
                that.tag[prop] = data[prop]
            }
        }


	}

}
},{}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
'use strict';

module.exports = function($http, geoService) {
  	return new function() {

  		var that = this;

        this.twitter = {};
        this.twitter.twitter_id      = '';
        this.twitter.state           = '';
        this.twitter.state_name      = '';


        this.load = function(data) {
            for(var prop in data) {
                that.twitter[prop] = data[prop]
            }
        }

        this.get = function(callback) {
            $http({
                url: "/twitter/" + geoService.state,
                method: 'GET',
            }).success(function(data, status, headers, config) {
                that.load(data);
                if(callback) {
                    callback(data);
                }
            }).error(function(data, status, headers, config) {
                console.log(data);
            });
        } 

	}

}
},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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
},{}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
/*! 
 * angular-advanced-searchbox
 * https://github.com/dnauck/angular-advanced-searchbox
 * Copyright (c) 2015 Nauck IT KG http://www.nauck-it.de/
 * Author: Daniel Nauck <d.nauck(at)nauck-it.de>
 * License: MIT
 */

(function() {

'use strict';

angular.module('angular-advanced-searchbox', [])
    .directive('nitAdvancedSearchbox', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=ngModel',
                parameters: '='
            },
            replace: true,
            templateUrl: 'angular-advanced-searchbox.html',
            controller: [
                '$scope', '$attrs', '$element', '$timeout', '$filter',
                function ($scope, $attrs, $element, $timeout, $filter) {

                    $scope.placeholder = $attrs.placeholder || 'Search ...';
                    $scope.searchParams = [];
                    $scope.searchQuery = '';
                    $scope.setSearchFocus = false;

                    $scope.$watch('searchQuery', function () {
                        updateModel();
                    });

                    $scope.$watch('searchParams', function () {
                        updateModel();
                    }, true);

                    $scope.enterEditMode = function(index) {
                        if (index === undefined)
                            return;

                        var searchParam = $scope.searchParams[index];
                        searchParam.editMode = true;
                    };

                    $scope.leaveEditMode = function(index) {
                        if (index === undefined)
                            return;

                        var searchParam = $scope.searchParams[index];
                        searchParam.editMode = false;

                        // remove empty search params
                        if (!searchParam.value)
                            $scope.removeSearchParam(index);
                    };

                    $scope.typeaheadOnSelect = function (item, model, label) {
                        $scope.addSearchParam(item);
                        $scope.searchQuery = '';
                    };

                    $scope.addSearchParam = function (searchParam, value, enterEditModel) {
                        if (enterEditModel === undefined)
                            enterEditModel = true;

                        $scope.searchParams.push(
                            {
                                key: searchParam.key,
                                name: searchParam.name,
                                placeholder: searchParam.placeholder,
                                value: value || '',
                                editMode: enterEditModel
                            }
                        );

                        //TODO: hide used suggestion
                    };

                    $scope.removeSearchParam = function (index) {
                        if (index === undefined)
                            return;

                        $scope.searchParams.splice(index, 1);

                        //TODO: show hidden/removed suggestion
                    };

                    $scope.removeAll = function() {
                        $scope.searchParams.length = 0;
                        $scope.searchQuery = '';
                        
                        //TODO: show hidden/removed suggestion
                    };

                    $scope.editPrevious = function(currentIndex) {
                        if (currentIndex !== undefined)
                            $scope.leaveEditMode(currentIndex);

                        //TODO: check if index == 0 -> what then?
                        if (currentIndex > 0) {
                            $scope.enterEditMode(currentIndex - 1);
                        } else if ($scope.searchParams.length > 0) {
                            $scope.enterEditMode($scope.searchParams.length - 1);
                        }
                    };

                    $scope.editNext = function(currentIndex) {
                        if (currentIndex === undefined)
                            return;

                        $scope.leaveEditMode(currentIndex);

                        //TODO: check if index == array length - 1 -> what then?
                        if (currentIndex < $scope.searchParams.length - 1) {
                            $scope.enterEditMode(currentIndex + 1);
                        } else {
                            $scope.setSearchFocus = true;
                        }
                    };

                    $scope.keydown = function(e, searchParamIndex) {
                        var handledKeys = [8, 9, 13, 37, 39];
                        if (handledKeys.indexOf(e.which) === -1)
                            return;

                        var cursorPosition = getCurrentCaretPosition(e.target);

                        if (e.which == 8) { // backspace
                            if (cursorPosition === 0)
                                $scope.editPrevious(searchParamIndex);

                        } else if (e.which == 9) { // tab
                            if (e.shiftKey) {
                                e.preventDefault();
                                $scope.editPrevious(searchParamIndex);
                            } else {
                                e.preventDefault();
                                $scope.editNext(searchParamIndex);
                            }

                        } else if (e.which == 13) { // enter
                            $scope.editNext(searchParamIndex);

                        } else if (e.which == 37) { // left
                            if (cursorPosition === 0)
                                $scope.editPrevious(searchParamIndex);

                        } else if (e.which == 39) { // right
                            if (cursorPosition === e.target.value.length)
                                $scope.editNext(searchParamIndex);
                        }
                    };

                    function restoreModel() {
                        angular.forEach($scope.model, function (value, key) {
                            if (key === 'query') {
                                $scope.searchQuery = value;
                            } else {
                                var searchParam = $filter('filter')($scope.parameters, function (param) { return param.key === key; })[0];
                                if (searchParam !== undefined)
                                    $scope.addSearchParam(searchParam, value, false);
                            }
                        });
                    }

                    if ($scope.model === undefined) {
                        $scope.model = {};
                    } else {
                        restoreModel();
                    }

                    var searchThrottleTimer;
                    function updateModel() {
                        if (searchThrottleTimer)
                            $timeout.cancel(searchThrottleTimer);

                        searchThrottleTimer = $timeout(function () {
                            $scope.model = {};

                            if ($scope.searchQuery.length > 0)
                                $scope.model.query = $scope.searchQuery;

                            angular.forEach($scope.searchParams, function (param) {
                                if (param.value !== undefined && param.value.length > 0)
                                    $scope.model[param.key] = param.value;
                            });
                        }, 500);
                    }

                    function getCurrentCaretPosition(input) {
                        if (!input)
                            return 0;

                        // Firefox & co
                        if (typeof input.selectionStart === 'number') {
                            return input.selectionDirection === 'backward' ? input.selectionStart : input.selectionEnd;

                        } else if (document.selection) { // IE
                            input.focus();
                            var selection = document.selection.createRange();
                            var selectionLength = document.selection.createRange().text.length;
                            selection.moveStart('character', -input.value.length);
                            return selection.text.length - selectionLength;
                        }

                        return 0;
                    }
                }
            ]
        };
    })
    .directive('nitSetFocus', [
        '$timeout', '$parse',
        function($timeout, $parse) {
            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    var model = $parse($attrs.nitSetFocus);
                    $scope.$watch(model, function(value) {
                        if (value === true) {
                            $timeout(function() {
                                $element[0].focus();
                            });
                        }
                    });
                    $element.bind('blur', function() {
                        $scope.$apply(model.assign($scope, false));
                    });
                }
            };
        }
    ])
    .directive('nitAutoSizeInput', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    model: '=ngModel'
                },
                link: function($scope, $element, $attrs) {
                    var container = angular.element('<div style="position: fixed; top: -9999px; left: 0px;"></div>');
                    var shadow = angular.element('<span style="white-space:pre;"></span>');

                    var maxWidth = $element.css('maxWidth') === 'none' ? $element.parent().innerWidth() : $element.css('maxWidth');
                    $element.css('maxWidth', maxWidth);

                    angular.forEach([
                        'fontSize', 'fontFamily', 'fontWeight', 'fontStyle',
                        'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent',
                        'boxSizing', 'borderLeftWidth', 'borderRightWidth', 'borderLeftStyle', 'borderRightStyle',
                        'paddingLeft', 'paddingRight', 'marginLeft', 'marginRight'
                    ], function(css) {
                        shadow.css(css, $element.css(css));
                    });

                    angular.element('body').append(container.append(shadow));

                    function resize() {
                        shadow.text($element.val() || $element.attr('placeholder'));
                        $element.css('width', shadow.outerWidth() + 10);
                    }

                    resize();

                    if ($scope.model) {
                        $scope.$watch('model', function() { resize(); });
                    } else {
                        $element.on('keypress keyup keydown focus input propertychange change', function() { resize(); });
                    }
                }
            };
        }
    ]);
})();
angular.module('angular-advanced-searchbox').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('angular-advanced-searchbox.html',
    "<div class=advancedSearchBox ng-class={active:focus} ng-init=\"focus = false\"><span ng-show=\"searchParams.length < 1 && searchQuery.length === 0\" class=\"search-icon glyphicon glyphicon-search\"></span> <a ng-href=\"\" ng-show=\"searchParams.length > 0 || searchQuery.length > 0\" ng-click=removeAll() role=button><span class=\"remove-all-icon glyphicon glyphicon-trash\"></span></a><div><div class=search-parameter ng-repeat=\"searchParam in searchParams\"><a ng-href=\"\" ng-click=removeSearchParam($index) role=button><span class=\"remove glyphicon glyphicon-trash\"></span></a><div class=key>{{searchParam.name}}:</div><div class=value><span ng-show=!searchParam.editMode ng-click=enterEditMode($index)>{{searchParam.value}}</span> <input name=value nit-auto-size-input nit-set-focus=searchParam.editMode ng-keydown=\"keydown($event, $index)\" ng-blur=leaveEditMode($index) ng-show=searchParam.editMode ng-model=searchParam.value placeholder=\"{{searchParam.placeholder}}\"></div></div><input name=searchbox class=search-parameter-input nit-set-focus=setSearchFocus ng-keydown=keydown($event) placeholder={{placeholder}} ng-focus=\"focus = true\" ng-blur=\"focus = false\" typeahead-on-select=\"typeaheadOnSelect($item, $model, $label)\" typeahead=\"parameter as parameter.name for parameter in parameters | filter:{name:$viewValue} | limitTo:8\" ng-model=\"searchQuery\"></div><div class=search-parameter-suggestions ng-show=\"parameters && focus\"><span class=title>Parameter Suggestions:</span> <span class=search-parameter ng-repeat=\"param in parameters | limitTo:8\" ng-mousedown=addSearchParam(param)>{{param.name}}</span></div></div>"
  );

}]);

},{}],39:[function(require,module,exports){
/*
 AngularJS v1.3.0-beta.5
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(r,f,Q){'use strict';f.module("ngAnimate",["ng"]).factory("$$animateReflow",["$$rAF","$document",function(f,r){return function(h){return f(function(){h()})}}]).config(["$provide","$animateProvider",function(ca,H){function h(h){for(var g=0;g<h.length;g++){var f=h[g];if(f.nodeType==Z)return f}}function E(g){return f.element(h(g))}var s=f.noop,g=f.forEach,R=H.$$selectors,Z=1,n="$$ngAnimateState",J="ng-animate",l={running:!0};ca.decorator("$animate",["$delegate","$injector","$sniffer","$rootElement",
"$$asyncCallback","$rootScope","$document",function(x,r,Y,K,F,I,Q){function S(a){if(a){var b=[],d={};a=a.substr(1).split(".");(Y.transitions||Y.animations)&&b.push(r.get(R[""]));for(var c=0;c<a.length;c++){var e=a[c],g=R[e];g&&!d[e]&&(b.push(r.get(g)),d[e]=!0)}return b}}function L(a,b,d){function c(a,b){var d=a[b],c=a["before"+b.charAt(0).toUpperCase()+b.substr(1)];if(d||c)return"leave"==b&&(c=d,d=null),A.push({event:b,fn:d}),m.push({event:b,fn:c}),!0}function e(b,c,e){var h=[];g(b,function(a){a.fn&&
h.push(a)});var k=0;g(h,function(b,u){var G=function(){a:{if(c){(c[u]||s)();if(++k<h.length)break a;c=null}e()}};switch(b.event){case "setClass":c.push(b.fn(a,y,B,G));break;case "addClass":c.push(b.fn(a,y||d,G));break;case "removeClass":c.push(b.fn(a,B||d,G));break;default:c.push(b.fn(a,G))}});c&&0===c.length&&e()}var h=a[0];if(h){var n="setClass"==b,l=n||"addClass"==b||"removeClass"==b,y,B;f.isArray(d)&&(y=d[0],B=d[1],d=y+" "+B);var z=a.attr("class")+" "+d;if(M(z)){var t=s,D=[],m=[],C=s,k=[],A=[],
z=(" "+z).replace(/\s+/g,".");g(S(z),function(a){!c(a,b)&&n&&(c(a,"addClass"),c(a,"removeClass"))});return{node:h,event:b,className:d,isClassBased:l,isSetClassOperation:n,before:function(a){t=a;e(m,D,function(){t=s;a()})},after:function(a){C=a;e(A,k,function(){C=s;a()})},cancel:function(){D&&(g(D,function(a){(a||s)(!0)}),t(!0));k&&(g(k,function(a){(a||s)(!0)}),C(!0))}}}}}function p(a,b,d,c,e,h,l){function s(c){var e="$animate:"+c;C&&(C[e]&&0<C[e].length)&&F(function(){d.triggerHandler(e,{event:a,
className:b})})}function y(){s("before")}function B(){s("after")}function r(){s("close");l&&F(function(){l()})}function t(){t.hasBeenRun||(t.hasBeenRun=!0,h())}function D(){if(!D.hasBeenRun){D.hasBeenRun=!0;var c=d.data(n);c&&(m&&m.isClassBased?z(d,b):(F(function(){var c=d.data(n)||{};p==c.index&&z(d,b,a)}),d.data(n,c)));r()}}var m=L(d,a,b);if(m){b=m.className;var C=f.element._data(m.node),C=C&&C.events;c||(c=e?e.parent():d.parent());var k=d.data(n)||{};e=k.active||{};var A=k.totalActive||0,x=k.last;
if(m.isClassBased&&(k.disabled||x&&!x.isClassBased)||N(d,c))t(),y(),B(),D();else{c=!1;if(0<A){k=[];if(m.isClassBased)"setClass"==x.event?(k.push(x),z(d,b)):e[b]&&(v=e[b],v.event==a?c=!0:(k.push(v),z(d,b)));else if("leave"==a&&e["ng-leave"])c=!0;else{for(var v in e)k.push(e[v]),z(d,v);e={};A=0}0<k.length&&g(k,function(a){a.cancel()})}!m.isClassBased||(m.isSetClassOperation||c)||(c="addClass"==a==d.hasClass(b));if(c)y(),B(),r();else{if("leave"==a)d.one("$destroy",function(a){a=f.element(this);var b=
a.data(n);b&&(b=b.active["ng-leave"])&&(b.cancel(),z(a,"ng-leave"))});d.addClass(J);var p=O++;A++;e[b]=m;d.data(n,{last:m,active:e,index:p,totalActive:A});y();m.before(function(c){var e=d.data(n);c=c||!e||!e.active[b]||m.isClassBased&&e.active[b].event!=a;t();!0===c?D():(B(),m.after(D))})}}}else t(),y(),B(),D()}function T(a){if(a=h(a))a=f.isFunction(a.getElementsByClassName)?a.getElementsByClassName(J):a.querySelectorAll("."+J),g(a,function(a){a=f.element(a);(a=a.data(n))&&a.active&&g(a.active,function(a){a.cancel()})})}
function z(a,b){if(h(a)==h(K))l.disabled||(l.running=!1,l.structural=!1);else if(b){var d=a.data(n)||{},c=!0===b;!c&&(d.active&&d.active[b])&&(d.totalActive--,delete d.active[b]);if(c||!d.totalActive)a.removeClass(J),a.removeData(n)}}function N(a,b){if(l.disabled)return!0;if(h(a)==h(K))return l.disabled||l.running;do{if(0===b.length)break;var d=h(b)==h(K),c=d?l:b.data(n)||{},c=c.disabled||c.running?!0:c.last&&!c.last.isClassBased;if(d||c)return c;if(d)break}while(b=b.parent());return!0}var O=0;K.data(n,
l);I.$$postDigest(function(){I.$$postDigest(function(){l.running=!1})});var P=H.classNameFilter(),M=P?function(a){return P.test(a)}:function(){return!0};return{enter:function(a,b,d,c){this.enabled(!1,a);x.enter(a,b,d);I.$$postDigest(function(){a=E(a);p("enter","ng-enter",a,b,d,s,c)})},leave:function(a,b){T(a);this.enabled(!1,a);I.$$postDigest(function(){p("leave","ng-leave",E(a),null,null,function(){x.leave(a)},b)})},move:function(a,b,d,c){T(a);this.enabled(!1,a);x.move(a,b,d);I.$$postDigest(function(){a=
E(a);p("move","ng-move",a,b,d,s,c)})},addClass:function(a,b,d){a=E(a);p("addClass",b,a,null,null,function(){x.addClass(a,b)},d)},removeClass:function(a,b,d){a=E(a);p("removeClass",b,a,null,null,function(){x.removeClass(a,b)},d)},setClass:function(a,b,d,c){a=E(a);p("setClass",[b,d],a,null,null,function(){x.setClass(a,b,d)},c)},enabled:function(a,b){switch(arguments.length){case 2:if(a)z(b);else{var d=b.data(n)||{};d.disabled=!0;b.data(n,d)}break;case 1:l.disabled=!a;break;default:a=!l.disabled}return!!a}}}]);
H.register("",["$window","$sniffer","$timeout","$$animateReflow",function(n,l,E,K){function F(a,u){v&&v();U.push(u);v=K(function(){g(U,function(a){a()});U=[];v=null;k={}})}function I(a,u){var b=h(a);a=f.element(b);V.push(a);b=Date.now()+u;b<=aa||(E.cancel($),aa=b,$=E(function(){J(V);V=[]},u,!1))}function J(a){g(a,function(a){(a=a.data(t))&&(a.closeAnimationFn||s)()})}function S(a,b){var c=b?k[b]:null;if(!c){var w=0,h=0,m=0,X=0,f,q,l,t;g(a,function(a){if(a.nodeType==Z){a=n.getComputedStyle(a)||{};
l=a[d+R];w=Math.max(L(l),w);t=a[d+W];f=a[d+y];h=Math.max(L(f),h);q=a[e+y];X=Math.max(L(q),X);var b=L(a[e+R]);0<b&&(b*=parseInt(a[e+B],10)||1);m=Math.max(b,m)}});c={total:0,transitionPropertyStyle:t,transitionDurationStyle:l,transitionDelayStyle:f,transitionDelay:h,transitionDuration:w,animationDelayStyle:q,animationDelay:X,animationDuration:m};b&&(k[b]=c)}return c}function L(a){var b=0;a=f.isString(a)?a.split(/\s*,\s*/):[];g(a,function(a){b=Math.max(parseFloat(a)||0,b)});return b}function p(a,b,c){a=
0<=["ng-enter","ng-leave","ng-move"].indexOf(c);var w,g=b.parent(),m=g.data(ba);m||(g.data(ba,++A),m=A);w=m+"-"+h(b).getAttribute("class");var g=w+" "+c,m=k[g]?++k[g].total:0,f={};if(0<m){var l=c+"-stagger",f=w+" "+l;(w=!k[f])&&b.addClass(l);f=S(b,f);w&&b.removeClass(l)}b.addClass(c);var l=b.data(t)||{},q=S(b,g);w=q.transitionDuration;q=q.animationDuration;if(a&&0===w&&0===q)return b.removeClass(c),!1;c=a&&0<w;a=0<q&&0<f.animationDelay&&0===f.animationDuration;b.data(t,{stagger:f,cacheKey:g,running:l.running||
0,itemIndex:m,blockTransition:c,blockAnimation:a,closeAnimationFn:s});b=h(b);c&&(b.style[d+W]="none");a&&(b.style[e]="none 0s");return!0}function T(a,u,G,w){function f(a){u.off(F,l);u.removeClass(n);M(u,G);a=h(u);for(var b in v)a.style.removeProperty(v[b])}function l(a){a.stopPropagation();var b=a.originalEvent||a;a=b.$manualTimeStamp||b.timeStamp||Date.now();b=parseFloat(b.elapsedTime.toFixed(D));Math.max(a-E,0)>=B&&b>=s&&w()}var k=h(u);a=u.data(t);if(-1!=k.getAttribute("class").indexOf(G)&&a){a.blockTransition&&
(k.style[d+W]="");a.blockAnimation&&(k.style[e]="");var n="";g(G.split(" "),function(a,b){n+=(0<b?" ":"")+a+"-active"});u.addClass(n);var q=S(u,a.eventCacheKey+" "+n),s=Math.max(q.transitionDuration,q.animationDuration);if(0===s)u.removeClass(n),M(u,G),w();else{var y=Math.max(q.transitionDelay,q.animationDelay),r=a.stagger,x=a.itemIndex,B=y*C,p="",v=[];if(0<q.transitionDuration){var A=q.transitionPropertyStyle;-1==A.indexOf("all")&&(p+=b+"transition-property: "+A+";",p+=b+"transition-duration: "+
q.transitionDurationStyle+";",v.push(b+"transition-property"),v.push(b+"transition-duration"))}0<x&&(0<r.transitionDelay&&0===r.transitionDuration&&(p+=b+"transition-delay: "+z(q.transitionDelayStyle,r.transitionDelay,x)+"; ",v.push(b+"transition-delay")),0<r.animationDelay&&0===r.animationDuration&&(p+=b+"animation-delay: "+z(q.animationDelayStyle,r.animationDelay,x)+"; ",v.push(b+"animation-delay")));0<v.length&&(q=k.getAttribute("style")||"",k.setAttribute("style",q+" "+p));var E=Date.now(),F=
H+" "+c;u.on(F,l);a.closeAnimationFn=function(){f();w()};k=(x*(Math.max(r.animationDelay,r.transitionDelay)||0)+(y+s)*m)*C;a.running++;I(u,k);return f}}else w()}function z(a,b,c){var d="";g(a.split(","),function(a,e){d+=(0<e?",":"")+(c*b+parseInt(a,10))+"s"});return d}function N(a,b,c,d){if(p(a,b,c,d))return function(a){a&&M(b,c)}}function O(a,b,c,d){if(b.data(t))return T(a,b,c,d);M(b,c);d()}function P(a,b,c,d){var e=N(a,b,c);if(e){var f=e;F(b,function(){f=O(a,b,c,d)});return function(a){(f||s)(a)}}d()}
function M(a,b){a.removeClass(b);var c=a.data(t);c&&(c.running&&c.running--,c.running&&0!==c.running||a.removeData(t))}function a(a,b){var c="";a=f.isArray(a)?a:a.split(/\s+/);g(a,function(a,d){a&&0<a.length&&(c+=(0<d?" ":"")+a+b)});return c}var b="",d,c,e,H;r.ontransitionend===Q&&r.onwebkittransitionend!==Q?(b="-webkit-",d="WebkitTransition",c="webkitTransitionEnd transitionend"):(d="transition",c="transitionend");r.onanimationend===Q&&r.onwebkitanimationend!==Q?(b="-webkit-",e="WebkitAnimation",
H="webkitAnimationEnd animationend"):(e="animation",H="animationend");var R="Duration",W="Property",y="Delay",B="IterationCount",ba="$$ngAnimateKey",t="$$ngAnimateCSS3Data",D=3,m=1.5,C=1E3,k={},A=0,U=[],v,$=null,aa=0,V=[];return{enter:function(a,b){return P("enter",a,"ng-enter",b)},leave:function(a,b){return P("leave",a,"ng-leave",b)},move:function(a,b){return P("move",a,"ng-move",b)},beforeSetClass:function(b,c,d,e){c=a(d,"-remove")+" "+a(c,"-add");if(c=N("setClass",b,c))return F(b,e),c;e()},beforeAddClass:function(b,
c,d){if(c=N("addClass",b,a(c,"-add")))return F(b,d),c;d()},beforeRemoveClass:function(b,c,d){if(c=N("removeClass",b,a(c,"-remove")))return F(b,d),c;d()},setClass:function(b,c,d,e){d=a(d,"-remove");c=a(c,"-add");return O("setClass",b,d+" "+c,e)},addClass:function(b,c,d){return O("addClass",b,a(c,"-add"),d)},removeClass:function(b,c,d){return O("removeClass",b,a(c,"-remove"),d)}}}])}])})(window,window.angular);


},{}],40:[function(require,module,exports){
/*globals define, jQuery, module, require */
/*jslint vars:true */

/**
 * @license angular-bootstrap-datetimepicker  version: 0.3.13
 * Copyright 2013-2015 Knight Rider Consulting, Inc. http://www.knightrider.com
 * License: MIT
 */

/**
 *
 *    @author        Dale "Ducky" Lotts
 *    @since        2013-Jul-8
 */

(function (factory) {
  'use strict';
  /* istanbul ignore if */
  if (typeof define === 'function' && /* istanbul ignore next */ define.amd) {
    define(['angular', 'moment'], factory); // AMD
    /* istanbul ignore next */
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'), require('moment')); // CommonJS
  } else {
    factory(window.angular, window.moment); // Browser global
  }
}(function (angular, moment) {
  'use strict';
  angular.module('ui.bootstrap.datetimepicker', [])
    .constant('dateTimePickerConfig', {
      dropdownSelector: null,
      minuteStep: 5,
      minView: 'minute',
      startView: 'day'
    })
    .directive('datetimepicker', ['$log', 'dateTimePickerConfig', function datetimepickerDirective($log, defaultConfig) {

      function DateObject() {

        var tempDate = new Date();
        var localOffset = tempDate.getTimezoneOffset() * 60000;
        this.utcDateValue = tempDate.getTime();
        this.selectable = true;

        this.localDateValue = function () {
          return this.utcDateValue + localOffset;
        };

        var validProperties = ['utcDateValue', 'localDateValue', 'display', 'active', 'selectable', 'past', 'future'];

        for (var prop in arguments[0]) {
          /* istanbul ignore else */
          //noinspection JSUnfilteredForInLoop
          if (validProperties.indexOf(prop) >= 0) {
            //noinspection JSUnfilteredForInLoop
            this[prop] = arguments[0][prop];
          }
        }
      }

      var validateConfiguration = function validateConfiguration(configuration) {
        var validOptions = ['startView', 'minView', 'minuteStep', 'dropdownSelector'];

        for (var prop in configuration) {
          //noinspection JSUnfilteredForInLoop
          if (validOptions.indexOf(prop) < 0) {
            throw ('invalid option: ' + prop);
          }
        }

        // Order of the elements in the validViews array is significant.
        var validViews = ['minute', 'hour', 'day', 'month', 'year'];

        if (validViews.indexOf(configuration.startView) < 0) {
          throw ('invalid startView value: ' + configuration.startView);
        }

        if (validViews.indexOf(configuration.minView) < 0) {
          throw ('invalid minView value: ' + configuration.minView);
        }

        if (validViews.indexOf(configuration.minView) > validViews.indexOf(configuration.startView)) {
          throw ('startView must be greater than minView');
        }

        if (!angular.isNumber(configuration.minuteStep)) {
          throw ('minuteStep must be numeric');
        }
        if (configuration.minuteStep <= 0 || configuration.minuteStep >= 60) {
          throw ('minuteStep must be greater than zero and less than 60');
        }
        if (configuration.dropdownSelector !== null && !angular.isString(configuration.dropdownSelector)) {
          throw ('dropdownSelector must be a string');
        }

        /* istanbul ignore next */
        if (configuration.dropdownSelector !== null && ((typeof jQuery === 'undefined') || (typeof jQuery().dropdown !== 'function'))) {
          $log.error('Please DO NOT specify the dropdownSelector option unless you are using jQuery AND Bootstrap.js. ' +
          'Please include jQuery AND Bootstrap.js, or write code to close the dropdown in the on-set-time callback. \n\n' +
          'The dropdownSelector configuration option is being removed because it will not function properly.');
          delete configuration.dropdownSelector;
        }
      };

      return {
        restrict: 'E',
        require: 'ngModel',
        template: '<div class="datetimepicker table-responsive">' +
        '<table class="table table-striped  {{ data.currentView }}-view">' +
        '   <thead>' +
        '       <tr>' +
        '           <th class="left" data-ng-click="changeView(data.currentView, data.leftDate, $event)" data-ng-show="data.leftDate.selectable"><i class="glyphicon glyphicon-arrow-left"/></th>' +
        '           <th class="switch" colspan="5" data-ng-show="data.previousViewDate.selectable" data-ng-click="changeView(data.previousView, data.previousViewDate, $event)">{{ data.previousViewDate.display }}</th>' +
        '           <th class="right" data-ng-click="changeView(data.currentView, data.rightDate, $event)" data-ng-show="data.rightDate.selectable"><i class="glyphicon glyphicon-arrow-right"/></th>' +
        '       </tr>' +
        '       <tr>' +
        '           <th class="dow" data-ng-repeat="day in data.dayNames" >{{ day }}</th>' +
        '       </tr>' +
        '   </thead>' +
        '   <tbody>' +
        '       <tr data-ng-if="data.currentView !== \'day\'" >' +
        '           <td colspan="7" >' +
        '              <span    class="{{ data.currentView }}" ' +
        '                       data-ng-repeat="dateObject in data.dates"  ' +
        '                       data-ng-class="{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: !dateObject.selectable}" ' +
        '                       data-ng-click="changeView(data.nextView, dateObject, $event)">{{ dateObject.display }}</span> ' +
        '           </td>' +
        '       </tr>' +
        '       <tr data-ng-if="data.currentView === \'day\'" data-ng-repeat="week in data.weeks">' +
        '           <td data-ng-repeat="dateObject in week.dates" ' +
        '               data-ng-click="changeView(data.nextView, dateObject, $event)"' +
        '               class="day" ' +
        '               data-ng-class="{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: !dateObject.selectable}" >{{ dateObject.display }}</td>' +
        '       </tr>' +
        '   </tbody>' +
        '</table></div>',
        scope: {
          onSetTime: '&',
          beforeRender: '&'
        },
        replace: true,
        link: function link(scope, element, attrs, ngModelController) {

          var directiveConfig = {};

          if (attrs.datetimepickerConfig) {
            directiveConfig = scope.$parent.$eval(attrs.datetimepickerConfig);
          }

          var configuration = {};

          angular.extend(configuration, defaultConfig, directiveConfig);

          validateConfiguration(configuration);

          var startOfDecade = function startOfDecade(unixDate) {
            var startYear = (parseInt(moment.utc(unixDate).year() / 10, 10) * 10);
            return moment.utc(unixDate).year(startYear).startOf('year');
          };

          var dataFactory = {
            year: function year(unixDate) {
              var selectedDate = moment.utc(unixDate).startOf('year');
              // View starts one year before the decade starts and ends one year after the decade ends
              // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
              // Truncate the last digit from the current year and subtract 1 to get the start of the decade
              var startDecade = (parseInt(selectedDate.year() / 10, 10) * 10);
              var startDate = moment.utc(startOfDecade(unixDate)).subtract(1, 'year').startOf('year');

              var activeYear = ngModelController.$modelValue ? moment(ngModelController.$modelValue).year() : 0;

              var result = {
                'currentView': 'year',
                'nextView': configuration.minView === 'year' ? 'setTime' : 'month',
                'previousViewDate': new DateObject({
                  utcDateValue: null,
                  display: startDecade + '-' + (startDecade + 9)
                }),
                'leftDate': new DateObject({utcDateValue: moment.utc(startDate).subtract(9, 'year').valueOf()}),
                'rightDate': new DateObject({utcDateValue: moment.utc(startDate).add(11, 'year').valueOf()}),
                'dates': []
              };

              for (var i = 0; i < 12; i += 1) {
                var yearMoment = moment.utc(startDate).add(i, 'years');
                var dateValue = {
                  'utcDateValue': yearMoment.valueOf(),
                  'display': yearMoment.format('YYYY'),
                  'past': yearMoment.year() < startDecade,
                  'future': yearMoment.year() > startDecade + 9,
                  'active': yearMoment.year() === activeYear
                };

                result.dates.push(new DateObject(dateValue));
              }

              return result;
            },

            month: function month(unixDate) {

              var startDate = moment.utc(unixDate).startOf('year');
              var previousViewDate = startOfDecade(unixDate);
              var activeDate = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MMM') : 0;

              var result = {
                'previousView': 'year',
                'currentView': 'month',
                'nextView': configuration.minView === 'month' ? 'setTime' : 'day',
                'previousViewDate': new DateObject({
                  utcDateValue: previousViewDate.valueOf(),
                  display: startDate.format('YYYY')
                }),
                'leftDate': new DateObject({utcDateValue: moment.utc(startDate).subtract(1, 'year').valueOf()}),
                'rightDate': new DateObject({utcDateValue: moment.utc(startDate).add(1, 'year').valueOf()}),
                'dates': []
              };

              for (var i = 0; i < 12; i += 1) {
                var monthMoment = moment.utc(startDate).add(i, 'months');
                var dateValue = {
                  'utcDateValue': monthMoment.valueOf(),
                  'display': monthMoment.format('MMM'),
                  'active': monthMoment.format('YYYY-MMM') === activeDate
                };

                result.dates.push(new DateObject(dateValue));
              }

              return result;
            },

            day: function day(unixDate) {

              var selectedDate = moment.utc(unixDate);
              var startOfMonth = moment.utc(selectedDate).startOf('month');
              var previousViewDate = moment.utc(selectedDate).startOf('year');
              var endOfMonth = moment.utc(selectedDate).endOf('month');

              var startDate = moment.utc(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');

              var activeDate = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MMM-DD') : '';

              var result = {
                'previousView': 'month',
                'currentView': 'day',
                'nextView': configuration.minView === 'day' ? 'setTime' : 'hour',
                'previousViewDate': new DateObject({
                  utcDateValue: previousViewDate.valueOf(),
                  display: startOfMonth.format('YYYY-MMM')
                }),
                'leftDate': new DateObject({utcDateValue: moment.utc(startOfMonth).subtract(1, 'months').valueOf()}),
                'rightDate': new DateObject({utcDateValue: moment.utc(startOfMonth).add(1, 'months').valueOf()}),
                'dayNames': [],
                'weeks': []
              };


              for (var dayNumber = 0; dayNumber < 7; dayNumber += 1) {
                result.dayNames.push(moment.utc().weekday(dayNumber).format('dd'));
              }

              for (var i = 0; i < 6; i += 1) {
                var week = {dates: []};
                for (var j = 0; j < 7; j += 1) {
                  var monthMoment = moment.utc(startDate).add((i * 7) + j, 'days');
                  var dateValue = {
                    'utcDateValue': monthMoment.valueOf(),
                    'display': monthMoment.format('D'),
                    'active': monthMoment.format('YYYY-MMM-DD') === activeDate,
                    'past': monthMoment.isBefore(startOfMonth),
                    'future': monthMoment.isAfter(endOfMonth)
                  };
                  week.dates.push(new DateObject(dateValue));
                }
                result.weeks.push(week);
              }

              return result;
            },

            hour: function hour(unixDate) {
              var selectedDate = moment.utc(unixDate).startOf('day');
              var previousViewDate = moment.utc(selectedDate).startOf('month');

              var activeFormat = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MM-DD H') : '';

              var result = {
                'previousView': 'day',
                'currentView': 'hour',
                'nextView': configuration.minView === 'hour' ? 'setTime' : 'minute',
                'previousViewDate': new DateObject({
                  utcDateValue: previousViewDate.valueOf(),
                  display: selectedDate.format('ll')
                }),
                'leftDate': new DateObject({utcDateValue: moment.utc(selectedDate).subtract(1, 'days').valueOf()}),
                'rightDate': new DateObject({utcDateValue: moment.utc(selectedDate).add(1, 'days').valueOf()}),
                'dates': []
              };

              for (var i = 0; i < 24; i += 1) {
                var hourMoment = moment.utc(selectedDate).add(i, 'hours');
                var dateValue = {
                  'utcDateValue': hourMoment.valueOf(),
                  'display': hourMoment.format('LT'),
                  'active': hourMoment.format('YYYY-MM-DD H') === activeFormat
                };

                result.dates.push(new DateObject(dateValue));
              }

              return result;
            },

            minute: function minute(unixDate) {
              var selectedDate = moment.utc(unixDate).startOf('hour');
              var previousViewDate = moment.utc(selectedDate).startOf('day');
              var activeFormat = ngModelController.$modelValue ? moment(ngModelController.$modelValue).format('YYYY-MM-DD H:mm') : '';

              var result = {
                'previousView': 'hour',
                'currentView': 'minute',
                'nextView': 'setTime',
                'previousViewDate': new DateObject({
                  utcDateValue: previousViewDate.valueOf(),
                  display: selectedDate.format('lll')
                }),
                'leftDate': new DateObject({utcDateValue: moment.utc(selectedDate).subtract(1, 'hours').valueOf()}),
                'rightDate': new DateObject({utcDateValue: moment.utc(selectedDate).add(1, 'hours').valueOf()}),
                'dates': []
              };

              var limit = 60 / configuration.minuteStep;

              for (var i = 0; i < limit; i += 1) {
                var hourMoment = moment.utc(selectedDate).add(i * configuration.minuteStep, 'minute');
                var dateValue = {
                  'utcDateValue': hourMoment.valueOf(),
                  'display': hourMoment.format('LT'),
                  'active': hourMoment.format('YYYY-MM-DD H:mm') === activeFormat
                };

                result.dates.push(new DateObject(dateValue));
              }

              return result;
            },

            setTime: function setTime(unixDate) {
              var tempDate = new Date(unixDate);
              var newDate = new Date(tempDate.getTime() + (tempDate.getTimezoneOffset() * 60000));

              var oldDate = ngModelController.$modelValue;
              ngModelController.$setViewValue(newDate);

              if (configuration.dropdownSelector) {
                jQuery(configuration.dropdownSelector).dropdown('toggle');
              }

              scope.onSetTime({newDate: newDate, oldDate: oldDate});

              return dataFactory[configuration.startView](unixDate);
            }
          };

          var getUTCTime = function getUTCTime(modelValue) {
            var tempDate = (modelValue ? moment(modelValue).toDate() : new Date());
            return tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000);
          };

          scope.changeView = function changeView(viewName, dateObject, event) {
            if (event) {
              event.stopPropagation();
              event.preventDefault();
            }

            if (viewName && (dateObject.utcDateValue > -Infinity) && dateObject.selectable && dataFactory[viewName]) {
              var result = dataFactory[viewName](dateObject.utcDateValue);

              var weekDates = [];
              if (result.weeks) {
                for (var i = 0; i < result.weeks.length; i += 1) {
                  var week = result.weeks[i];
                  for (var j = 0; j < week.dates.length; j += 1) {
                    var weekDate = week.dates[j];
                    weekDates.push(weekDate);
                  }
                }
              }

              scope.beforeRender({
                $view: result.currentView,
                $dates: result.dates || weekDates,
                $leftDate: result.leftDate,
                $upDate: result.previousViewDate,
                $rightDate: result.rightDate
              });

              scope.data = result;
            }
          };

          ngModelController.$render = function $render() {
            scope.changeView(configuration.startView, new DateObject({utcDateValue: getUTCTime(ngModelController.$viewValue)}));
          };
        }
      };
    }]);
}));


},{"angular":42,"moment":52}],41:[function(require,module,exports){
/*
 angular-file-upload v1.1.1
 https://github.com/nervgh/angular-file-upload
*/
(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define('angular-file-upload', ['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(typeof angular === 'undefined' ? null : angular, function(angular) {

var module = angular.module('angularFileUpload', []);

'use strict';

/**
 * Classes
 *
 * FileUploader
 * FileUploader.FileLikeObject
 * FileUploader.FileItem
 * FileUploader.FileDirective
 * FileUploader.FileSelect
 * FileUploader.FileDrop
 * FileUploader.FileOver
 */

module


    .value('fileUploaderOptions', {
        url: '/',
        alias: 'file',
        headers: {},
        queue: [],
        progress: 0,
        autoUpload: false,
        removeAfterUpload: false,
        method: 'POST',
        filters: [],
        formData: [],
        queueLimit: 1,
        //Number.MAX_VALUE,
        withCredentials: false
    })


    .factory('FileUploader', ['fileUploaderOptions', '$rootScope', '$http', '$window', '$compile',
        function(fileUploaderOptions, $rootScope, $http, $window, $compile) {
            /**
             * Creates an instance of FileUploader
             * @param {Object} [options]
             * @constructor
             */
            function FileUploader(options) {
                var settings = angular.copy(fileUploaderOptions);
                angular.extend(this, settings, options, {
                    isUploading: false,
                    _nextIndex: 0,
                    _failFilterIndex: -1,
                    _directives: {select: [], drop: [], over: []}
                });

                // add default filters
                this.filters.unshift({name: 'queueLimit', fn: this._queueLimitFilter});
                this.filters.unshift({name: 'folder', fn: this._folderFilter});
            }
            /**********************
             * PUBLIC
             **********************/
            /**
             * Checks a support the html5 uploader
             * @returns {Boolean}
             * @readonly
             */
            FileUploader.prototype.isHTML5 = !!($window.File && $window.FormData);
            /**
             * Adds items to the queue
             * @param {File|HTMLInputElement|Object|FileList|Array<Object>} files
             * @param {Object} [options]
             * @param {Array<Function>|String} filters
             */
            FileUploader.prototype.addToQueue = function(files, options, filters) {
                var list = this.isArrayLikeObject(files) ? files: [files];
                var arrayOfFilters = this._getFilters(filters);
                var count = this.queue.length;
                var addedFileItems = [];

                angular.forEach(list, function(some /*{File|HTMLInputElement|Object}*/) {
                    var temp = new FileUploader.FileLikeObject(some);

                    if (this._isValidFile(temp, arrayOfFilters, options)) {
                        var fileItem = new FileUploader.FileItem(this, some, options);
                        addedFileItems.push(fileItem);
                        this.queue.push(fileItem);
                        this._onAfterAddingFile(fileItem);
                    } else {
                        var filter = this.filters[this._failFilterIndex];
                        this._onWhenAddingFileFailed(temp, filter, options);
                    }
                }, this);

                if(this.queue.length !== count) {
                    this._onAfterAddingAll(addedFileItems);
                    this.progress = this._getTotalProgress();
                }

                this._render();
                if (this.autoUpload) this.uploadAll();
            };
            /**
             * Remove items from the queue. Remove last: index = -1
             * @param {FileItem|Number} value
             */
            FileUploader.prototype.removeFromQueue = function(value) {
                var index = this.getIndexOfItem(value);
                var item = this.queue[index];
                if (item.isUploading) item.cancel();
                this.queue.splice(index, 1);
                item._destroy();
                this.progress = this._getTotalProgress();
            };
            /**
             * Clears the queue
             */
            FileUploader.prototype.clearQueue = function() {
                while(this.queue.length) {
                    this.queue[0].remove();
                }
                this.progress = 0;
            };
            /**
             * Uploads a item from the queue
             * @param {FileItem|Number} value
             */
            FileUploader.prototype.uploadItem = function(value) {
                var index = this.getIndexOfItem(value);
                var item = this.queue[index];
                var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';

                item._prepareToUploading();
                if(this.isUploading) return;

                this.isUploading = true;
                this[transport](item);
            };
            /**
             * Cancels uploading of item from the queue
             * @param {FileItem|Number} value
             */
            FileUploader.prototype.cancelItem = function(value) {
                var index = this.getIndexOfItem(value);
                var item = this.queue[index];
                var prop = this.isHTML5 ? '_xhr' : '_form';
                if (item && item.isUploading) item[prop].abort();
            };
            /**
             * Uploads all not uploaded items of queue
             */
            FileUploader.prototype.uploadAll = function() {
                var items = this.getNotUploadedItems().filter(function(item) {
                    return !item.isUploading;
                });
                if (!items.length) return;

                angular.forEach(items, function(item) {
                    item._prepareToUploading();
                });
                items[0].upload();
            };
            /**
             * Cancels all uploads
             */
            FileUploader.prototype.cancelAll = function() {
                var items = this.getNotUploadedItems();
                angular.forEach(items, function(item) {
                    item.cancel();
                });
            };
            /**
             * Returns "true" if value an instance of File
             * @param {*} value
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype.isFile = function(value) {
                var fn = $window.File;
                return (fn && value instanceof fn);
            };
            /**
             * Returns "true" if value an instance of FileLikeObject
             * @param {*} value
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype.isFileLikeObject = function(value) {
                return value instanceof FileUploader.FileLikeObject;
            };
            /**
             * Returns "true" if value is array like object
             * @param {*} value
             * @returns {Boolean}
             */
            FileUploader.prototype.isArrayLikeObject = function(value) {
                return (angular.isObject(value) && 'length' in value);
            };
            /**
             * Returns a index of item from the queue
             * @param {Item|Number} value
             * @returns {Number}
             */
            FileUploader.prototype.getIndexOfItem = function(value) {
                return angular.isNumber(value) ? value : this.queue.indexOf(value);
            };
            /**
             * Returns not uploaded items
             * @returns {Array}
             */
            FileUploader.prototype.getNotUploadedItems = function() {
                return this.queue.filter(function(item) {
                    return !item.isUploaded;
                });
            };
            /**
             * Returns items ready for upload
             * @returns {Array}
             */
            FileUploader.prototype.getReadyItems = function() {
                return this.queue
                    .filter(function(item) {
                        return (item.isReady && !item.isUploading);
                    })
                    .sort(function(item1, item2) {
                        return item1.index - item2.index;
                    });
            };
            /**
             * Destroys instance of FileUploader
             */
            FileUploader.prototype.destroy = function() {
                angular.forEach(this._directives, function(key) {
                    angular.forEach(this._directives[key], function(object) {
                        object.destroy();
                    }, this);
                }, this);
            };
            /**
             * Callback
             * @param {Array} fileItems
             */
            FileUploader.prototype.onAfterAddingAll = function(fileItems) {};
            /**
             * Callback
             * @param {FileItem} fileItem
             */
            FileUploader.prototype.onAfterAddingFile = function(fileItem) {};
            /**
             * Callback
             * @param {File|Object} item
             * @param {Object} filter
             * @param {Object} options
             * @private
             */
            FileUploader.prototype.onWhenAddingFileFailed = function(item, filter, options) {};
            /**
             * Callback
             * @param {FileItem} fileItem
             */
            FileUploader.prototype.onBeforeUploadItem = function(fileItem) {};
            /**
             * Callback
             * @param {FileItem} fileItem
             * @param {Number} progress
             */
            FileUploader.prototype.onProgressItem = function(fileItem, progress) {};
            /**
             * Callback
             * @param {Number} progress
             */
            FileUploader.prototype.onProgressAll = function(progress) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onSuccessItem = function(item, response, status, headers) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onErrorItem = function(item, response, status, headers) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onCancelItem = function(item, response, status, headers) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onCompleteItem = function(item, response, status, headers) {};
            /**
             * Callback
             */
            FileUploader.prototype.onCompleteAll = function() {};
            /**********************
             * PRIVATE
             **********************/
            /**
             * Returns the total progress
             * @param {Number} [value]
             * @returns {Number}
             * @private
             */
            FileUploader.prototype._getTotalProgress = function(value) {
                if(this.removeAfterUpload) return value || 0;

                var notUploaded = this.getNotUploadedItems().length;
                var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
                var ratio = 100 / this.queue.length;
                var current = (value || 0) * ratio / 100;

                return Math.round(uploaded * ratio + current);
            };
            /**
             * Returns array of filters
             * @param {Array<Function>|String} filters
             * @returns {Array<Function>}
             * @private
             */
            FileUploader.prototype._getFilters = function(filters) {
                if (angular.isUndefined(filters)) return this.filters;
                if (angular.isArray(filters)) return filters;
                var names = filters.split(/\s*,/);
                return this.filters.filter(function(filter) {
                    return names.indexOf(filter.name) !== -1;
                }, this);
            };
            /**
             * Updates html
             * @private
             */
            FileUploader.prototype._render = function() {
                if (!$rootScope.$$phase) $rootScope.$apply();
            };
            /**
             * Returns "true" if item is a file (not folder)
             * @param {File|FileLikeObject} item
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._folderFilter = function(item) {
                return !!(item.size || item.type);
            };
            /**
             * Returns "true" if the limit has not been reached
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._queueLimitFilter = function() {
                return this.queue.length < this.queueLimit;
            };
            /**
             * Returns "true" if file pass all filters
             * @param {File|Object} file
             * @param {Array<Function>} filters
             * @param {Object} options
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._isValidFile = function(file, filters, options) {
                this._failFilterIndex = -1;
                return !filters.length ? true : filters.every(function(filter) {
                    this._failFilterIndex++;
                    return filter.fn.call(this, file, options);
                }, this);
            };
            /**
             * Checks whether upload successful
             * @param {Number} status
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._isSuccessCode = function(status) {
                return (status >= 200 && status < 300) || status === 304;
            };
            /**
             * Transforms the server response
             * @param {*} response
             * @returns {*}
             * @private
             */
            FileUploader.prototype._transformResponse = function(response) {
                angular.forEach($http.defaults.transformResponse, function(transformFn) {
                    response = transformFn(response);
                });
                return response;
            };
            /**
             * Parsed response headers
             * @param headers
             * @returns {Object}
             * @see https://github.com/angular/angular.js/blob/master/src/ng/http.js
             * @private
             */
            FileUploader.prototype._parseHeaders = function(headers) {
                var parsed = {}, key, val, i;

                if (!headers) return parsed;

                function trim(string) {
                    return string.replace(/^\s+/, '').replace(/\s+$/, '');
                }
                function lowercase(string) {
                    return string.toLowerCase();
                }

                angular.forEach(headers.split('\n'), function(line) {
                    i = line.indexOf(':');
                    key = lowercase(trim(line.substr(0, i)));
                    val = trim(line.substr(i + 1));

                    if (key) {
                        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                    }
                });

                return parsed;
            };
            /**
             * The XMLHttpRequest transport
             * @param {FileItem} item
             * @private
             */
            FileUploader.prototype._xhrTransport = function(item) {
                var xhr = item._xhr = new XMLHttpRequest();
                var form = new FormData();
                var that = this;

                that._onBeforeUploadItem(item);

                angular.forEach(item.formData, function(obj) {
                    angular.forEach(obj, function(value, key) {
                        form.append(key, value);
                    });
                });

                form.append(item.alias, item._file, item.file.name);

                xhr.upload.onprogress = function(event) {
                    var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                    that._onProgressItem(item, progress);
                };

                xhr.onload = function() {
                    var headers = that._parseHeaders(xhr.getAllResponseHeaders());
                    var response = that._transformResponse(xhr.response);
                    var gist = that._isSuccessCode(xhr.status) ? 'Success' : 'Error';
                    var method = '_on' + gist + 'Item';
                    that[method](item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                xhr.onerror = function() {
                    var headers = that._parseHeaders(xhr.getAllResponseHeaders());
                    var response = that._transformResponse(xhr.response);
                    that._onErrorItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                xhr.onabort = function() {
                    var headers = that._parseHeaders(xhr.getAllResponseHeaders());
                    var response = that._transformResponse(xhr.response);
                    that._onCancelItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                xhr.open(item.method, item.url, true);

                xhr.withCredentials = item.withCredentials;

                angular.forEach(item.headers, function(value, name) {
                    xhr.setRequestHeader(name, value);
                });

                xhr.send(form);
                this._render();
            };
            /**
             * The IFrame transport
             * @param {FileItem} item
             * @private
             */
            FileUploader.prototype._iframeTransport = function(item) {
                var form = angular.element('<form style="display: none;" />');
                var iframe = angular.element('<iframe name="iframeTransport' + Date.now() + '">');
                var input = item._input;
                var that = this;

                if (item._form) item._form.replaceWith(input); // remove old form
                item._form = form; // save link to new form

                that._onBeforeUploadItem(item);

                input.prop('name', item.alias);

                angular.forEach(item.formData, function(obj) {
                    angular.forEach(obj, function(value, key) {
                        form.append(angular.element('<input type="hidden" name="' + key + '" value="' + value + '" />'));
                    });
                });

                form.prop({
                    action: item.url,
                    method: 'POST',
                    target: iframe.prop('name'),
                    enctype: 'multipart/form-data',
                    encoding: 'multipart/form-data' // old IE
                });

                iframe.bind('load', function() {
                    try {
                        // Fix for legacy IE browsers that loads internal error page
                        // when failed WS response received. In consequence iframe
                        // content access denied error is thrown becouse trying to
                        // access cross domain page. When such thing occurs notifying
                        // with empty response object. See more info at:
                        // http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
                        // Note that if non standard 4xx or 5xx error code returned
                        // from WS then response content can be accessed without error
                        // but 'XHR' status becomes 200. In order to avoid confusion
                        // returning response via same 'success' event handler.

                        // fixed angular.contents() for iframes
                        var html = iframe[0].contentDocument.body.innerHTML;
                    } catch (e) {}

                    var xhr = {response: html, status: 200, dummy: true};
                    var response = that._transformResponse(xhr.response);
                    var headers = {};

                    that._onSuccessItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                });

                form.abort = function() {
                    var xhr = {status: 0, dummy: true};
                    var headers = {};
                    var response;

                    iframe.unbind('load').prop('src', 'javascript:false;');
                    form.replaceWith(input);

                    that._onCancelItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                input.after(form);
                form.append(input).append(iframe);

                form[0].submit();
                this._render();
            };
            /**
             * Inner callback
             * @param {File|Object} item
             * @param {Object} filter
             * @param {Object} options
             * @private
             */
            FileUploader.prototype._onWhenAddingFileFailed = function(item, filter, options) {
                this.onWhenAddingFileFailed(item, filter, options);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             */
            FileUploader.prototype._onAfterAddingFile = function(item) {
                this.onAfterAddingFile(item);
            };
            /**
             * Inner callback
             * @param {Array<FileItem>} items
             */
            FileUploader.prototype._onAfterAddingAll = function(items) {
                this.onAfterAddingAll(items);
            };
            /**
             *  Inner callback
             * @param {FileItem} item
             * @private
             */
            FileUploader.prototype._onBeforeUploadItem = function(item) {
                item._onBeforeUpload();
                this.onBeforeUploadItem(item);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {Number} progress
             * @private
             */
            FileUploader.prototype._onProgressItem = function(item, progress) {
                var total = this._getTotalProgress(progress);
                this.progress = total;
                item._onProgress(progress);
                this.onProgressItem(item, progress);
                this.onProgressAll(total);
                this._render();
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onSuccessItem = function(item, response, status, headers) {
                item._onSuccess(response, status, headers);
                this.onSuccessItem(item, response, status, headers);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onErrorItem = function(item, response, status, headers) {
                item._onError(response, status, headers);
                this.onErrorItem(item, response, status, headers);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onCancelItem = function(item, response, status, headers) {
                item._onCancel(response, status, headers);
                this.onCancelItem(item, response, status, headers);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onCompleteItem = function(item, response, status, headers) {
                item._onComplete(response, status, headers);
                this.onCompleteItem(item, response, status, headers);

                var nextItem = this.getReadyItems()[0];
                this.isUploading = false;

                if(angular.isDefined(nextItem)) {
                    nextItem.upload();
                    return;
                }

                this.onCompleteAll();
                this.progress = this._getTotalProgress();
                this._render();
            };
            /**********************
             * STATIC
             **********************/
            /**
             * @borrows FileUploader.prototype.isFile
             */
            FileUploader.isFile = FileUploader.prototype.isFile;
            /**
             * @borrows FileUploader.prototype.isFileLikeObject
             */
            FileUploader.isFileLikeObject = FileUploader.prototype.isFileLikeObject;
            /**
             * @borrows FileUploader.prototype.isArrayLikeObject
             */
            FileUploader.isArrayLikeObject = FileUploader.prototype.isArrayLikeObject;
            /**
             * @borrows FileUploader.prototype.isHTML5
             */
            FileUploader.isHTML5 = FileUploader.prototype.isHTML5;
            /**
             * Inherits a target (Class_1) by a source (Class_2)
             * @param {Function} target
             * @param {Function} source
             */
            FileUploader.inherit = function(target, source) {
                target.prototype = Object.create(source.prototype);
                target.prototype.constructor = target;
                target.super_ = source;
            };
            FileUploader.FileLikeObject = FileLikeObject;
            FileUploader.FileItem = FileItem;
            FileUploader.FileDirective = FileDirective;
            FileUploader.FileSelect = FileSelect;
            FileUploader.FileDrop = FileDrop;
            FileUploader.FileOver = FileOver;

            // ---------------------------

            /**
             * Creates an instance of FileLikeObject
             * @param {File|HTMLInputElement|Object} fileOrInput
             * @constructor
             */
            function FileLikeObject(fileOrInput) {
                var isInput = angular.isElement(fileOrInput);
                var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
                var postfix = angular.isString(fakePathOrObject) ? 'FakePath' : 'Object';
                var method = '_createFrom' + postfix;
                this[method](fakePathOrObject);
            }

            /**
             * Creates file like object from fake path string
             * @param {String} path
             * @private
             */
            FileLikeObject.prototype._createFromFakePath = function(path) {
                this.lastModifiedDate = null;
                this.size = null;
                this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
                this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
            };
            /**
             * Creates file like object from object
             * @param {File|FileLikeObject} object
             * @private
             */
            FileLikeObject.prototype._createFromObject = function(object) {
                this.lastModifiedDate = angular.copy(object.lastModifiedDate);
                this.size = object.size;
                this.type = object.type;
                this.name = object.name;
            };

            // ---------------------------

            /**
             * Creates an instance of FileItem
             * @param {FileUploader} uploader
             * @param {File|HTMLInputElement|Object} some
             * @param {Object} options
             * @constructor
             */
            function FileItem(uploader, some, options) {
                var isInput = angular.isElement(some);
                var input = isInput ? angular.element(some) : null;
                var file = !isInput ? some : null;

                angular.extend(this, {
                    url: uploader.url,
                    alias: uploader.alias,
                    headers: angular.copy(uploader.headers),
                    formData: angular.copy(uploader.formData),
                    removeAfterUpload: uploader.removeAfterUpload,
                    withCredentials: uploader.withCredentials,
                    method: uploader.method
                }, options, {
                    uploader: uploader,
                    file: new FileUploader.FileLikeObject(some),
                    isReady: false,
                    isUploading: false,
                    isUploaded: false,
                    isSuccess: false,
                    isCancel: false,
                    isError: false,
                    progress: 0,
                    index: null,
                    _file: file,
                    _input: input
                });

                if (input) this._replaceNode(input);
            }
            /**********************
             * PUBLIC
             **********************/
            /**
             * Uploads a FileItem
             */
            FileItem.prototype.upload = function() {
                this.uploader.uploadItem(this);
            };
            /**
             * Cancels uploading of FileItem
             */
            FileItem.prototype.cancel = function() {
                this.uploader.cancelItem(this);
            };
            /**
             * Removes a FileItem
             */
            FileItem.prototype.remove = function() {
                this.uploader.removeFromQueue(this);
            };
            /**
             * Callback
             * @private
             */
            FileItem.prototype.onBeforeUpload = function() {};
            /**
             * Callback
             * @param {Number} progress
             * @private
             */
            FileItem.prototype.onProgress = function(progress) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onSuccess = function(response, status, headers) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onError = function(response, status, headers) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onCancel = function(response, status, headers) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onComplete = function(response, status, headers) {};
            /**********************
             * PRIVATE
             **********************/
            /**
             * Inner callback
             */
            FileItem.prototype._onBeforeUpload = function() {
                this.isReady = true;
                this.isUploading = true;
                this.isUploaded = false;
                this.isSuccess = false;
                this.isCancel = false;
                this.isError = false;
                this.progress = 0;
                this.onBeforeUpload();
            };
            /**
             * Inner callback
             * @param {Number} progress
             * @private
             */
            FileItem.prototype._onProgress = function(progress) {
                this.progress = progress;
                this.onProgress(progress);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onSuccess = function(response, status, headers) {
                this.isReady = false;
                this.isUploading = false;
                this.isUploaded = true;
                this.isSuccess = true;
                this.isCancel = false;
                this.isError = false;
                this.progress = 100;
                this.index = null;
                this.onSuccess(response, status, headers);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onError = function(response, status, headers) {
                this.isReady = false;
                this.isUploading = false;
                this.isUploaded = true;
                this.isSuccess = false;
                this.isCancel = false;
                this.isError = true;
                this.progress = 0;
                this.index = null;
                this.onError(response, status, headers);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onCancel = function(response, status, headers) {
                this.isReady = false;
                this.isUploading = false;
                this.isUploaded = false;
                this.isSuccess = false;
                this.isCancel = true;
                this.isError = false;
                this.progress = 0;
                this.index = null;
                this.onCancel(response, status, headers);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onComplete = function(response, status, headers) {
                this.onComplete(response, status, headers);
                if (this.removeAfterUpload) this.remove();
            };
            /**
             * Destroys a FileItem
             */
            FileItem.prototype._destroy = function() {
                if (this._input) this._input.remove();
                if (this._form) this._form.remove();
                delete this._form;
                delete this._input;
            };
            /**
             * Prepares to uploading
             * @private
             */
            FileItem.prototype._prepareToUploading = function() {
                this.index = this.index || ++this.uploader._nextIndex;
                this.isReady = true;
            };
            /**
             * Replaces input element on his clone
             * @param {JQLite|jQuery} input
             * @private
             */
            FileItem.prototype._replaceNode = function(input) {
                var clone = $compile(input.clone())(input.scope());
                clone.prop('value', null); // FF fix
                input.css('display', 'none');
                input.after(clone); // remove jquery dependency
            };

            // ---------------------------

            /**
             * Creates instance of {FileDirective} object
             * @param {Object} options
             * @param {Object} options.uploader
             * @param {HTMLElement} options.element
             * @param {Object} options.events
             * @param {String} options.prop
             * @constructor
             */
            function FileDirective(options) {
                angular.extend(this, options);
                this.uploader._directives[this.prop].push(this);
                this._saveLinks();
                this.bind();
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileDirective.prototype.events = {};
            /**
             * Binds events handles
             */
            FileDirective.prototype.bind = function() {
                for(var key in this.events) {
                    var prop = this.events[key];
                    this.element.bind(key, this[prop]);
                }
            };
            /**
             * Unbinds events handles
             */
            FileDirective.prototype.unbind = function() {
                for(var key in this.events) {
                    this.element.unbind(key, this.events[key]);
                }
            };
            /**
             * Destroys directive
             */
            FileDirective.prototype.destroy = function() {
                var index = this.uploader._directives[this.prop].indexOf(this);
                this.uploader._directives[this.prop].splice(index, 1);
                this.unbind();
                // this.element = null;
            };
            /**
             * Saves links to functions
             * @private
             */
            FileDirective.prototype._saveLinks = function() {
                for(var key in this.events) {
                    var prop = this.events[key];
                    this[prop] = this[prop].bind(this);
                }
            };

            // ---------------------------

            FileUploader.inherit(FileSelect, FileDirective);

            /**
             * Creates instance of {FileSelect} object
             * @param {Object} options
             * @constructor
             */
            function FileSelect(options) {
                FileSelect.super_.apply(this, arguments);

                if(!this.uploader.isHTML5) {
                    this.element.removeAttr('multiple');
                }
                this.element.prop('value', null); // FF fix
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileSelect.prototype.events = {
                $destroy: 'destroy',
                change: 'onChange'
            };
            /**
             * Name of property inside uploader._directive object
             * @type {String}
             */
            FileSelect.prototype.prop = 'select';
            /**
             * Returns options
             * @return {Object|undefined}
             */
            FileSelect.prototype.getOptions = function() {};
            /**
             * Returns filters
             * @return {Array<Function>|String|undefined}
             */
            FileSelect.prototype.getFilters = function() {};
            /**
             * If returns "true" then HTMLInputElement will be cleared
             * @returns {Boolean}
             */
            FileSelect.prototype.isEmptyAfterSelection = function() {
                return !!this.element.attr('multiple');
            };
            /**
             * Event handler
             */
            FileSelect.prototype.onChange = function() {
                var files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
                var options = this.getOptions();
                var filters = this.getFilters();

                this.uploader.clearQueue();

                if (!this.uploader.isHTML5) this.destroy();
                this.uploader.addToQueue(files, options, filters);
                if (this.isEmptyAfterSelection()) this.element.prop('value', null);
            };

            // ---------------------------

            FileUploader.inherit(FileDrop, FileDirective);

            /**
             * Creates instance of {FileDrop} object
             * @param {Object} options
             * @constructor
             */
            function FileDrop(options) {
                FileDrop.super_.apply(this, arguments);
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileDrop.prototype.events = {
                $destroy: 'destroy',
                drop: 'onDrop',
                dragover: 'onDragOver',
                dragleave: 'onDragLeave'
            };
            /**
             * Name of property inside uploader._directive object
             * @type {String}
             */
            FileDrop.prototype.prop = 'drop';
            /**
             * Returns options
             * @return {Object|undefined}
             */
            FileDrop.prototype.getOptions = function() {};
            /**
             * Returns filters
             * @return {Array<Function>|String|undefined}
             */
            FileDrop.prototype.getFilters = function() {};
            /**
             * Event handler
             */
            FileDrop.prototype.onDrop = function(event) {
                var transfer = this._getTransfer(event);
                if (!transfer) return;
                var options = this.getOptions();
                var filters = this.getFilters();
                this._preventAndStop(event);
                angular.forEach(this.uploader._directives.over, this._removeOverClass, this);
                this.uploader.addToQueue(transfer.files, options, filters);
            };
            /**
             * Event handler
             */
            FileDrop.prototype.onDragOver = function(event) {
                var transfer = this._getTransfer(event);
                if(!this._haveFiles(transfer.types)) return;
                transfer.dropEffect = 'copy';
                this._preventAndStop(event);
                angular.forEach(this.uploader._directives.over, this._addOverClass, this);
            };
            /**
             * Event handler
             */
            FileDrop.prototype.onDragLeave = function(event) {
                if (event.target !== this.element[0]) return;
                this._preventAndStop(event);
                angular.forEach(this.uploader._directives.over, this._removeOverClass, this);
            };
            /**
             * Helper
             */
            FileDrop.prototype._getTransfer = function(event) {
                return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
            };
            /**
             * Helper
             */
            FileDrop.prototype._preventAndStop = function(event) {
                event.preventDefault();
                event.stopPropagation();
            };
            /**
             * Returns "true" if types contains files
             * @param {Object} types
             */
            FileDrop.prototype._haveFiles = function(types) {
                if (!types) return false;
                if (types.indexOf) {
                    return types.indexOf('Files') !== -1;
                } else if(types.contains) {
                    return types.contains('Files');
                } else {
                    return false;
                }
            };
            /**
             * Callback
             */
            FileDrop.prototype._addOverClass = function(item) {
                item.addOverClass();
            };
            /**
             * Callback
             */
            FileDrop.prototype._removeOverClass = function(item) {
                item.removeOverClass();
            };

            // ---------------------------

            FileUploader.inherit(FileOver, FileDirective);

            /**
             * Creates instance of {FileDrop} object
             * @param {Object} options
             * @constructor
             */
            function FileOver(options) {
                FileOver.super_.apply(this, arguments);
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileOver.prototype.events = {
                $destroy: 'destroy'
            };
            /**
             * Name of property inside uploader._directive object
             * @type {String}
             */
            FileOver.prototype.prop = 'over';
            /**
             * Over class
             * @type {string}
             */
            FileOver.prototype.overClass = 'nv-file-over';
            /**
             * Adds over class
             */
            FileOver.prototype.addOverClass = function() {
                this.element.addClass(this.getOverClass());
            };
            /**
             * Removes over class
             */
            FileOver.prototype.removeOverClass = function() {
                this.element.removeClass(this.getOverClass());
            };
            /**
             * Returns over class
             * @returns {String}
             */
            FileOver.prototype.getOverClass = function() {
                return this.overClass;
            };

            return FileUploader;
        }])


    .directive('nvFileSelect', ['$parse', 'FileUploader', function($parse, FileUploader) {
        return {
            link: function(scope, element, attributes) {
                var uploader = scope.$eval(attributes.uploader);

                if (!(uploader instanceof FileUploader)) {
                    throw new TypeError('"Uploader" must be an instance of FileUploader');
                }

                var object = new FileUploader.FileSelect({
                    uploader: uploader,
                    element: element
                });

                object.getOptions = $parse(attributes.options).bind(object, scope);
                object.getFilters = function() {return attributes.filters;};
            }
        };
    }])


    .directive('nvFileDrop', ['$parse', 'FileUploader', function($parse, FileUploader) {
        return {
            link: function(scope, element, attributes) {
                var uploader = scope.$eval(attributes.uploader);

                if (!(uploader instanceof FileUploader)) {
                    throw new TypeError('"Uploader" must be an instance of FileUploader');
                }

                if (!uploader.isHTML5) return;

                var object = new FileUploader.FileDrop({
                    uploader: uploader,
                    element: element
                });

                object.getOptions = $parse(attributes.options).bind(object, scope);
                object.getFilters = function() {return attributes.filters;};
            }
        };
    }])


    .directive('nvFileOver', ['FileUploader', function(FileUploader) {
        return {
            link: function(scope, element, attributes) {
                var uploader = scope.$eval(attributes.uploader);

                if (!(uploader instanceof FileUploader)) {
                    throw new TypeError('"Uploader" must be an instance of FileUploader');
                }

                var object = new FileUploader.FileOver({
                    uploader: uploader,
                    element: element
                });

                object.getOverClass = function() {
                    return attributes.overClass || this.overClass;
                };
            }
        };
    }])
    return module;
}));
},{}],42:[function(require,module,exports){
require('./angular.min.js');


module.exports = angular;

},{"./angular.min.js":50}],43:[function(require,module,exports){
/**
 * An Angular module that gives you access to the browsers local storage
 * @version v0.2.2 - 2015-05-29
 * @link https://github.com/grevory/angular-local-storage
 * @author grevory <greg@gregpike.ca>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function ( window, angular, undefined ) {
/*jshint globalstrict:true*/
'use strict';

var isDefined = angular.isDefined,
  isUndefined = angular.isUndefined,
  isNumber = angular.isNumber,
  isObject = angular.isObject,
  isArray = angular.isArray,
  extend = angular.extend,
  toJson = angular.toJson;
var angularLocalStorage = angular.module('LocalStorageModule', []);

angularLocalStorage.provider('localStorageService', function() {

  // You should set a prefix to avoid overwriting any local storage variables from the rest of your app
  // e.g. localStorageServiceProvider.setPrefix('yourAppName');
  // With provider you can use config as this:
  // myApp.config(function (localStorageServiceProvider) {
  //    localStorageServiceProvider.prefix = 'yourAppName';
  // });
  this.prefix = 'ls';

  // You could change web storage type localstorage or sessionStorage
  this.storageType = 'localStorage';

  // Cookie options (usually in case of fallback)
  // expiry = Number of days before cookies expire // 0 = Does not expire
  // path = The web path the cookie represents
  this.cookie = {
    expiry: 30,
    path: '/'
  };

  // Send signals for each of the following actions?
  this.notify = {
    setItem: true,
    removeItem: false
  };

  // Setter for the prefix
  this.setPrefix = function(prefix) {
    this.prefix = prefix;
    return this;
  };

   // Setter for the storageType
   this.setStorageType = function(storageType) {
     this.storageType = storageType;
     return this;
   };

  // Setter for cookie config
  this.setStorageCookie = function(exp, path) {
    this.cookie.expiry = exp;
    this.cookie.path = path;
    return this;
  };

  // Setter for cookie domain
  this.setStorageCookieDomain = function(domain) {
    this.cookie.domain = domain;
    return this;
  };

  // Setter for notification config
  // itemSet & itemRemove should be booleans
  this.setNotify = function(itemSet, itemRemove) {
    this.notify = {
      setItem: itemSet,
      removeItem: itemRemove
    };
    return this;
  };

  this.$get = ['$rootScope', '$window', '$document', '$parse', function($rootScope, $window, $document, $parse) {
    var self = this;
    var prefix = self.prefix;
    var cookie = self.cookie;
    var notify = self.notify;
    var storageType = self.storageType;
    var webStorage;

    // When Angular's $document is not available
    if (!$document) {
      $document = document;
    } else if ($document[0]) {
      $document = $document[0];
    }

    // If there is a prefix set in the config lets use that with an appended period for readability
    if (prefix.substr(-1) !== '.') {
      prefix = !!prefix ? prefix + '.' : '';
    }
    var deriveQualifiedKey = function(key) {
      return prefix + key;
    };
    // Checks the browser to see if local storage is supported
    var browserSupportsLocalStorage = (function () {
      try {
        var supported = (storageType in $window && $window[storageType] !== null);

        // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
        // is available, but trying to call .setItem throws an exception.
        //
        // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage
        // that exceeded the quota."
        var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
        if (supported) {
          webStorage = $window[storageType];
          webStorage.setItem(key, '');
          webStorage.removeItem(key);
        }

        return supported;
      } catch (e) {
        storageType = 'cookie';
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return false;
      }
    }());

    // Directly adds a value to local storage
    // If local storage is not available in the browser use cookies
    // Example use: localStorageService.add('library','angular');
    var addToLocalStorage = function (key, value) {
      // Let's convert undefined values to null to get the value consistent
      if (isUndefined(value)) {
        value = null;
      } else {
        value = toJson(value);
      }

      // If this browser does not support local storage use cookies
      if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
        if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        }

        if (notify.setItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'cookie'});
        }
        return addToCookies(key, value);
      }

      try {
        if (webStorage) {webStorage.setItem(deriveQualifiedKey(key), value)};
        if (notify.setItem) {
          $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: self.storageType});
        }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
        return addToCookies(key, value);
      }
      return true;
    };

    // Directly get a value from local storage
    // Example use: localStorageService.get('library'); // returns 'angular'
    var getFromLocalStorage = function (key) {

      if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
        if (!browserSupportsLocalStorage) {
          $rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
        }

        return getFromCookies(key);
      }

      var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
      // angular.toJson will convert null to 'null', so a proper conversion is needed
      // FIXME not a perfect solution, since a valid 'null' string can't be stored
      if (!item || item === 'null') {
        return null;
      }

      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    };

    // Remove an item from local storage
    // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
    var removeFromLocalStorage = function () {
      var i, key;
      for (i=0; i<arguments.length; i++) {
        key = arguments[i];
        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          if (notify.removeItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'cookie'});
          }
          removeFromCookies(key);
        }
        else {
          try {
            webStorage.removeItem(deriveQualifiedKey(key));
            if (notify.removeItem) {
              $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {
                key: key,
                storageType: self.storageType
              });
            }
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
            removeFromCookies(key);
          }
        }
      }
    };

    // Return array of keys for local storage
    // Example use: var keys = localStorageService.keys()
    var getKeysForLocalStorage = function () {

      if (!browserSupportsLocalStorage) {
        $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        return false;
      }

      var prefixLength = prefix.length;
      var keys = [];
      for (var key in webStorage) {
        // Only return keys that are for this app
        if (key.substr(0,prefixLength) === prefix) {
          try {
            keys.push(key.substr(prefixLength));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
            return [];
          }
        }
      }
      return keys;
    };

    // Remove all data for this app from local storage
    // Also optionally takes a regular expression string and removes the matching key-value pairs
    // Example use: localStorageService.clearAll();
    // Should be used mostly for development purposes
    var clearAllFromLocalStorage = function (regularExpression) {

      // Setting both regular expressions independently
      // Empty strings result in catchall RegExp
      var prefixRegex = !!prefix ? new RegExp('^' + prefix) : new RegExp();
      var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp();

      if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
        if (!browserSupportsLocalStorage) {
          $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
        }
        return clearAllFromCookies();
      }

      var prefixLength = prefix.length;

      for (var key in webStorage) {
        // Only remove items that are for this app and match the regular expression
        if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
          try {
            removeFromLocalStorage(key.substr(prefixLength));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
            return clearAllFromCookies();
          }
        }
      }
      return true;
    };

    // Checks the browser to see if cookies are supported
    var browserSupportsCookies = (function() {
      try {
        return $window.navigator.cookieEnabled ||
          ("cookie" in $document && ($document.cookie.length > 0 ||
          ($document.cookie = "test").indexOf.call($document.cookie, "test") > -1));
      } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
      }
    }());

    // Directly adds a value to cookies
    // Typically used as a fallback is local storage is not available in the browser
    // Example use: localStorageService.cookie.add('library','angular');
    var addToCookies = function (key, value, daysToExpiry) {

      if (isUndefined(value)) {
        return false;
      } else if(isArray(value) || isObject(value)) {
        value = toJson(value);
      }

      if (!browserSupportsCookies) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      try {
        var expiry = '',
            expiryDate = new Date(),
            cookieDomain = '';

        if (value === null) {
          // Mark that the cookie has expired one day ago
          expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
          value = '';
        } else if (isNumber(daysToExpiry) && daysToExpiry !== 0) {
          expiryDate.setTime(expiryDate.getTime() + (daysToExpiry * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
        } else if (cookie.expiry !== 0) {
          expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
          expiry = "; expires=" + expiryDate.toGMTString();
        }
        if (!!key) {
          var cookiePath = "; path=" + cookie.path;
          if(cookie.domain){
            cookieDomain = "; domain=" + cookie.domain;
          }
          $document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath + cookieDomain;
        }
      } catch (e) {
        $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
        return false;
      }
      return true;
    };

    // Directly get a value from a cookie
    // Example use: localStorageService.cookie.get('library'); // returns 'angular'
    var getFromCookies = function (key) {
      if (!browserSupportsCookies) {
        $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
        return false;
      }

      var cookies = $document.cookie && $document.cookie.split(';') || [];
      for(var i=0; i < cookies.length; i++) {
        var thisCookie = cookies[i];
        while (thisCookie.charAt(0) === ' ') {
          thisCookie = thisCookie.substring(1,thisCookie.length);
        }
        if (thisCookie.indexOf(deriveQualifiedKey(key) + '=') === 0) {
          var storedValues = decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length))
          try {
            return JSON.parse(storedValues);
          } catch(e) {
            return storedValues
          }
        }
      }
      return null;
    };

    var removeFromCookies = function (key) {
      addToCookies(key,null);
    };

    var clearAllFromCookies = function () {
      var thisCookie = null, thisKey = null;
      var prefixLength = prefix.length;
      var cookies = $document.cookie.split(';');
      for(var i = 0; i < cookies.length; i++) {
        thisCookie = cookies[i];

        while (thisCookie.charAt(0) === ' ') {
          thisCookie = thisCookie.substring(1, thisCookie.length);
        }

        var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
        removeFromCookies(key);
      }
    };

    var getStorageType = function() {
      return storageType;
    };

    // Add a listener on scope variable to save its changes to local storage
    // Return a function which when called cancels binding
    var bindToScope = function(scope, key, def, lsKey) {
      lsKey = lsKey || key;
      var value = getFromLocalStorage(lsKey);

      if (value === null && isDefined(def)) {
        value = def;
      } else if (isObject(value) && isObject(def)) {
        value = extend(def, value);
      }

      $parse(key).assign(scope, value);

      return scope.$watch(key, function(newVal) {
        addToLocalStorage(lsKey, newVal);
      }, isObject(scope[key]));
    };

    // Return localStorageService.length
    // ignore keys that not owned
    var lengthOfLocalStorage = function() {
      var count = 0;
      var storage = $window[storageType];
      for(var i = 0; i < storage.length; i++) {
        if(storage.key(i).indexOf(prefix) === 0 ) {
          count++;
        }
      }
      return count;
    };

    return {
      isSupported: browserSupportsLocalStorage,
      getStorageType: getStorageType,
      set: addToLocalStorage,
      add: addToLocalStorage, //DEPRECATED
      get: getFromLocalStorage,
      keys: getKeysForLocalStorage,
      remove: removeFromLocalStorage,
      clearAll: clearAllFromLocalStorage,
      bind: bindToScope,
      deriveKey: deriveQualifiedKey,
      length: lengthOfLocalStorage,
      cookie: {
        isSupported: browserSupportsCookies,
        set: addToCookies,
        add: addToCookies, //DEPRECATED
        get: getFromCookies,
        remove: removeFromCookies,
        clearAll: clearAllFromCookies
      }
    };
  }];
});
})( window, window.angular );
},{}],44:[function(require,module,exports){
/**
 * @license AngularJS v1.3.0-beta.5
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider);

/**
 * @ngdoc provider
 * @name $routeProvider
 * @function
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider(){
  function inherit(parent, extra) {
    return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
   *      published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
   *      is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `redirectTo` – {(string|function())=} – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    routes[path] = angular.extend(
      {reloadOnSearch: true},
      route,
      path && pathRegExp(path, route)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length-1] == '/')
            ? path.substr(0, path.length-1)
            : path +'/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, route)
      );
    }

    return this;
  };

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
        var optional = option === '?' ? option : null;
        var star = option === '*' ? option : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object} params Mapping information to be assigned to `$route.current`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$http',
               '$templateCache',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as define in route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * Note that this example is using {@link ng.directive:script inlined templates}
     * to get it working on jsfiddle as well.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route dependencies are resolved.
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     *
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     */

    var forceReload = false,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope, reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;
            $rootScope.$evalAsync(updateRoute);
          }
        };

    $rootScope.$on('$locationChangeSuccess', updateRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = 'string' == typeof m[i]
              ? decodeURIComponent(m[i])
              : m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function updateRoute() {
      var next = parseRoute(),
          last = $route.current;

      if (next && last && next.$$route === last.$$route
          && angular.equals(next.pathParams, last.pathParams)
          && !next.reloadOnSearch && !forceReload) {
        last.params = next.params;
        angular.copy(last.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', last);
      } else if (next || last) {
        forceReload = false;
        $rootScope.$broadcast('$routeChangeStart', next, last);
        $route.current = next;
        if (next) {
          if (next.redirectTo) {
            if (angular.isString(next.redirectTo)) {
              $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                       .replace();
            } else {
              $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(next).
          then(function() {
            if (next) {
              var locals = angular.extend({}, next.resolve),
                  template, templateUrl;

              angular.forEach(locals, function(value, key) {
                locals[key] = angular.isString(value) ?
                    $injector.get(value) : $injector.invoke(value);
              });

              if (angular.isDefined(template = next.template)) {
                if (angular.isFunction(template)) {
                  template = template(next.params);
                }
              } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                if (angular.isFunction(templateUrl)) {
                  templateUrl = templateUrl(next.params);
                }
                templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                if (angular.isDefined(templateUrl)) {
                  next.loadedTemplateUrl = templateUrl;
                  template = $http.get(templateUrl, {cache: $templateCache}).
                      then(function(response) { return response.data; });
                }
              }
              if (angular.isDefined(template)) {
                locals['$template'] = template;
              }
              return $q.all(locals);
            }
          }).
          // after route change
          then(function(locals) {
            if (next == $route.current) {
              if (next) {
                next.locals = locals;
                angular.copy(next.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', next, last);
            }
          }, function(error) {
            if (next == $route.current) {
              $rootScope.$broadcast('$routeChangeError', next, last, error);
            }
          });
      }
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string||'').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:1, sectionId:2, search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * enter - animation is used to bring new content into the browser.
 * leave - animation is used to animate existing content away.
 *
 * The enter and leave animation occur concurrently.
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          position:relative;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              // configure html5 to get links working on jsfiddle
              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory(   $route,   $anchorScroll,   $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousElement,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if(previousElement) {
            previousElement.remove();
            previousElement = null;
          }
          if(currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if(currentElement) {
            $animate.leave(currentElement, function() {
              previousElement = null;
            });
            previousElement = currentElement;
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }

      link(scope);
    }
  };
}


})(window, window.angular);

},{}],45:[function(require,module,exports){
/**
 * @license AngularJS v1.2.25
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

var $sanitizeMinErr = angular.$$minErr('$sanitize');

/**
 * @ngdoc module
 * @name ngSanitize
 * @description
 *
 * # ngSanitize
 *
 * The `ngSanitize` module provides functionality to sanitize HTML.
 *
 *
 * <div doc-module-components="ngSanitize"></div>
 *
 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
 */

/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */


/**
 * @ngdoc service
 * @name $sanitize
 * @kind function
 *
 * @description
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however, since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
 *
 * @param {string} html Html input.
 * @returns {string} Sanitized html.
 *
 * @example
   <example module="sanitizeExample" deps="angular-sanitize.js">
   <file name="index.html">
     <script>
         angular.module('sanitizeExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
             $scope.snippet =
               '<p style="color:blue">an html\n' +
               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
               'snippet</p>';
             $scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.snippet);
             };
           }]);
     </script>
     <div ng-controller="ExampleController">
        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Directive</td>
           <td>How</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="bind-html-with-sanitize">
           <td>ng-bind-html</td>
           <td>Automatically uses $sanitize</td>
           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind-html="snippet"></div></td>
         </tr>
         <tr id="bind-html-with-trust">
           <td>ng-bind-html</td>
           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
           <td>
           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
&lt;/div&gt;</pre>
           </td>
           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
         </tr>
         <tr id="bind-default">
           <td>ng-bind</td>
           <td>Automatically escapes</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
       </div>
   </file>
   <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
   </file>
   </example>
 */
function $SanitizeProvider() {
  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
    return function(html) {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
      }));
      return buf.join('');
    };
  }];
}

function sanitizeText(chars) {
  var buf = [];
  var writer = htmlSanitizeWriter(buf, angular.noop);
  writer.chars(chars);
  return buf.join('');
}


// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP =
       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  // Match everything outside of normal chars and " (quote character)
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    optionalEndTagInlineElements = makeMap("rp,rt"),
    optionalEndTagElements = angular.extend({},
                                            optionalEndTagInlineElements,
                                            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
var specialElements = makeMap("script,style");

var validElements = angular.extend({},
                                   voidElements,
                                   blockElements,
                                   inlineElements,
                                   optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
var validAttrs = angular.extend({}, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

function makeMap(str) {
  var obj = {}, items = str.split(','), i;
  for (i = 0; i < items.length; i++) obj[items[i]] = true;
  return obj;
}


/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  if (typeof html !== 'string') {
    if (html === null || typeof html === 'undefined') {
      html = '';
    } else {
      html = '' + html;
    }
  }
  var index, chars, match, stack = [], last = html, text;
  stack.last = function() { return stack[ stack.length - 1 ]; };

  while ( html ) {
    text = '';
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        // comments containing -- are not allowed unless they terminate the comment
        index = html.indexOf("--", 4);

        if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
          if (handler.comment) handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }
      // DOCTYPE
      } else if ( DOCTYPE_REGEXP.test(html) ) {
        match = html.match( DOCTYPE_REGEXP );

        if ( match ) {
          html = html.replace( match[0], '');
          chars = false;
        }
      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          // We only have a valid start-tag if there is a '>'.
          if ( match[4] ) {
            html = html.substring( match[0].length );
            match[0].replace( START_TAG_REGEXP, parseStartTag );
          }
          chars = false;
        } else {
          // no ending tag found --- this piece should be encoded as an entity.
          text += '<';
          html = html.substring(1);
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        text += index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        if (handler.chars) handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
        function(all, text){
          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

          if (handler.chars) handler.chars( decodeEntities(text) );

          return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                                        "of html: {0}", html);
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = angular.lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = voidElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP,
      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
        var value = doubleQuotedValue
          || singleQuotedValue
          || unquotedValue
          || '';

        attrs[name] = decodeEntities(value);
    });
    if (handler.start) handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = angular.lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        if (handler.end) handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

var hiddenPre=document.createElement("pre");
var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
function decodeEntities(value) {
  if (!value) { return ''; }

  // Note: IE8 does not preserve spaces at the start/end of innerHTML
  // so we must capture them and reattach them afterward
  var parts = spaceRe.exec(value);
  var spaceBefore = parts[1];
  var spaceAfter = parts[3];
  var content = parts[2];
  if (content) {
    hiddenPre.innerHTML=content.replace(/</g,"&lt;");
    // innerText depends on styling as it doesn't display hidden elements.
    // Therefore, it's better to use textContent not to cause unnecessary
    // reflows. However, IE<9 don't support textContent so the innerText
    // fallback is necessary.
    content = 'textContent' in hiddenPre ?
      hiddenPre.textContent : hiddenPre.innerText;
  }
  return spaceBefore + content + spaceAfter;
}

/**
 * Escapes all potentially dangerous characters, so that the
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns {string} escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(SURROGATE_PAIR_REGEXP, function (value) {
      var hi = value.charCodeAt(0);
      var low = value.charCodeAt(1);
      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
    }).
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf, uriValidator){
  var ignore = false;
  var out = angular.bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = angular.lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] === true) {
        out('<');
        out(tag);
        angular.forEach(attrs, function(value, key){
          var lkey=angular.lowercase(key);
          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
          if (validAttrs[lkey] === true &&
            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = angular.lowercase(tag);
        if (!ignore && validElements[tag] === true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}


// define ngSanitize module and register $sanitize service
angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

/* global sanitizeText: false */

/**
 * @ngdoc filter
 * @name linky
 * @kind function
 *
 * @description
 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 * plain email address links.
 *
 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
 *
 * @param {string} text Input text.
 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
 * @returns {string} Html-linkified text.
 *
 * @usage
   <span ng-bind-html="linky_expression | linky"></span>
 *
 * @example
   <example module="linkyExample" deps="angular-sanitize.js">
     <file name="index.html">
       <script>
         angular.module('linkyExample', ['ngSanitize'])
           .controller('ExampleController', ['$scope', function($scope) {
             $scope.snippet =
               'Pretty text with some links:\n'+
               'http://angularjs.org/,\n'+
               'mailto:us@somewhere.org,\n'+
               'another@somewhere.org,\n'+
               'and one more: ftp://127.0.0.1/.';
             $scope.snippetWithTarget = 'http://angularjs.org/';
           }]);
       </script>
       <div ng-controller="ExampleController">
       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
       <table>
         <tr>
           <td>Filter</td>
           <td>Source</td>
           <td>Rendered</td>
         </tr>
         <tr id="linky-filter">
           <td>linky filter</td>
           <td>
             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
           </td>
           <td>
             <div ng-bind-html="snippet | linky"></div>
           </td>
         </tr>
         <tr id="linky-target">
          <td>linky target</td>
          <td>
            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
          </td>
          <td>
            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
          </td>
         </tr>
         <tr id="escaped-html">
           <td>no filter</td>
           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
           <td><div ng-bind="snippet"></div></td>
         </tr>
       </table>
     </file>
     <file name="protractor.js" type="protractor">
       it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
       });

       it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
       });

       it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

       it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
   </example>
 */
angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
  var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"]/,
      MAILTO_REGEXP = /^mailto:/;

  return function(text, target) {
    if (!text) return text;
    var match;
    var raw = text;
    var html = [];
    var url;
    var i;
    while ((match = raw.match(LINKY_URL_REGEXP))) {
      // We can not end in these as they are sometimes found at the end of the sentence
      url = match[0];
      // if we did not match ftp/http/mailto then assume mailto
      if (match[2] == match[3]) url = 'mailto:' + url;
      i = match.index;
      addText(raw.substr(0, i));
      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
      raw = raw.substring(i + match[0].length);
    }
    addText(raw);
    return $sanitize(html.join(''));

    function addText(text) {
      if (!text) {
        return;
      }
      html.push(sanitizeText(text));
    }

    function addLink(url, text) {
      html.push('<a ');
      if (angular.isDefined(target)) {
        html.push('target="');
        html.push(target);
        html.push('" ');
      }
      html.push('href="');
      html.push(url);
      html.push('">');
      addText(text);
      html.push('</a>');
    }
  };
}]);


})(window, window.angular);

},{}],46:[function(require,module,exports){
var duScrollDefaultEasing=function(e){"use strict";return.5>e?Math.pow(2*e,2)/2:1-Math.pow(2*(1-e),2)/2};angular.module("duScroll",["duScroll.scrollspy","duScroll.smoothScroll","duScroll.scrollContainer","duScroll.spyContext","duScroll.scrollHelpers"]).value("duScrollDuration",350).value("duScrollSpyWait",100).value("duScrollGreedy",!1).value("duScrollOffset",0).value("duScrollEasing",duScrollDefaultEasing),angular.module("duScroll.scrollHelpers",["duScroll.requestAnimation"]).run(["$window","$q","cancelAnimation","requestAnimation","duScrollEasing","duScrollDuration","duScrollOffset",function(e,t,n,r,o,l,i){"use strict";var u=angular.element.prototype,c=function(e){return"undefined"!=typeof HTMLDocument&&e instanceof HTMLDocument||e.nodeType&&e.nodeType===e.DOCUMENT_NODE},a=function(e){return"undefined"!=typeof HTMLElement&&e instanceof HTMLElement||e.nodeType&&e.nodeType===e.ELEMENT_NODE},s=function(e){return a(e)||c(e)?e:e[0]};u.scrollTo=function(t,n,r){var o;if(angular.isElement(t)?o=this.scrollToElement:r&&(o=this.scrollToAnimated),o)return o.apply(this,arguments);var l=s(this);return c(l)?e.scrollTo(t,n):(l.scrollLeft=t,void(l.scrollTop=n))};var d,f;u.scrollToAnimated=function(e,l,i,u){i&&!u&&(u=o);var c=this.scrollLeft(),a=this.scrollTop(),s=Math.round(e-c),p=Math.round(l-a),m=null,g=this,v="scroll mousedown mousewheel touchmove keydown",h=function(e){(!e||e.which>0)&&(g.unbind(v,h),n(d),f.reject(),d=null)};if(d&&h(),f=t.defer(),!s&&!p)return f.resolve(),f.promise;var y=function(e){null===m&&(m=e);var t=e-m,n=t>=i?1:u(t/i);g.scrollTo(c+Math.ceil(s*n),a+Math.ceil(p*n)),1>n?d=r(y):(g.unbind(v,h),d=null,f.resolve())};return g.scrollTo(c,a),g.bind(v,h),d=r(y),f.promise},u.scrollToElement=function(e,t,n,r){var o=s(this);(!angular.isNumber(t)||isNaN(t))&&(t=i);var l=this.scrollTop()+s(e).getBoundingClientRect().top-t;return a(o)&&(l-=o.getBoundingClientRect().top),this.scrollTo(0,l,n,r)};var p={scrollLeft:function(t,n,r){if(angular.isNumber(t))return this.scrollTo(t,this.scrollTop(),n,r);var o=s(this);return c(o)?e.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft:o.scrollLeft},scrollTop:function(t,n,r){if(angular.isNumber(t))return this.scrollTo(this.scrollTop(),t,n,r);var o=s(this);return c(o)?e.scrollY||document.documentElement.scrollTop||document.body.scrollTop:o.scrollTop}};u.scrollToElementAnimated=function(e,t,n,r){return this.scrollToElement(e,t,n||l,r)},u.scrollTopAnimated=function(e,t,n){return this.scrollTop(e,t||l,n)},u.scrollLeftAnimated=function(e,t,n){return this.scrollLeft(e,t||l,n)};var m=function(e,t){return function(n,r){return r?t.apply(this,arguments):e.apply(this,arguments)}};for(var g in p)u[g]=u[g]?m(u[g],p[g]):p[g]}]),angular.module("duScroll.polyfill",[]).factory("polyfill",["$window",function(e){"use strict";var t=["webkit","moz","o","ms"];return function(n,r){if(e[n])return e[n];for(var o,l=n.substr(0,1).toUpperCase()+n.substr(1),i=0;i<t.length;i++)if(o=t[i]+l,e[o])return e[o];return r}}]),angular.module("duScroll.requestAnimation",["duScroll.polyfill"]).factory("requestAnimation",["polyfill","$timeout",function(e,t){"use strict";var n=0,r=function(e){var r=(new Date).getTime(),o=Math.max(0,16-(r-n)),l=t(function(){e(r+o)},o);return n=r+o,l};return e("requestAnimationFrame",r)}]).factory("cancelAnimation",["polyfill","$timeout",function(e,t){"use strict";var n=function(e){t.cancel(e)};return e("cancelAnimationFrame",n)}]),angular.module("duScroll.spyAPI",["duScroll.scrollContainerAPI"]).factory("spyAPI",["$rootScope","$timeout","scrollContainerAPI","duScrollGreedy","duScrollSpyWait",function(e,t,n,r,o){"use strict";var l=function(n){var l=!1,i=!1,u=function(){i=!1;var t=n.container,o=t[0],l=0;("undefined"!=typeof HTMLElement&&o instanceof HTMLElement||o.nodeType&&o.nodeType===o.ELEMENT_NODE)&&(l=o.getBoundingClientRect().top);var u,c,a,s,d,f;for(s=n.spies,c=n.currentlyActive,a=void 0,u=0;u<s.length;u++)d=s[u],f=d.getTargetPosition(),f&&f.top+d.offset-l<20&&-1*f.top+l<f.height&&(!a||a.top<f.top)&&(a={top:f.top,spy:d});a&&(a=a.spy),c===a||r&&!a||(c&&(c.$element.removeClass("active"),e.$broadcast("duScrollspy:becameInactive",c.$element)),a&&(a.$element.addClass("active"),e.$broadcast("duScrollspy:becameActive",a.$element)),n.currentlyActive=a)};return o?function(){l?i=!0:(u(),l=t(function(){l=!1,i&&u()},o,!1))}:u},i={},u=function(e){var t=e.$id,n={spies:[]};return n.handler=l(n),i[t]=n,e.$on("$destroy",function(){c(e)}),t},c=function(e){var t=e.$id,n=i[t],r=n.container;r&&r.off("scroll",n.handler),delete i[t]},a=u(e),s=function(e){return i[e.$id]?i[e.$id]:e.$parent?s(e.$parent):i[a]},d=function(e){var t,n,r=e.$element.scope();if(r)return s(r);for(n in i)if(t=i[n],-1!==t.spies.indexOf(e))return t},f=function(e){for(;e.parentNode;)if(e=e.parentNode,e===document)return!0;return!1},p=function(e){var t=d(e);t&&(t.spies.push(e),t.container&&f(t.container)||(t.container&&t.container.off("scroll",t.handler),t.container=n.getContainer(e.$element.scope()),t.container.on("scroll",t.handler).triggerHandler("scroll")))},m=function(e){var t=d(e);e===t.currentlyActive&&(t.currentlyActive=null);var n=t.spies.indexOf(e);-1!==n&&t.spies.splice(n,1)};return{addSpy:p,removeSpy:m,createContext:u,destroyContext:c,getContextForScope:s}}]),angular.module("duScroll.scrollContainerAPI",[]).factory("scrollContainerAPI",["$document",function(e){"use strict";var t={},n=function(e,n){var r=e.$id;return t[r]=n,r},r=function(e){return t[e.$id]?e.$id:e.$parent?r(e.$parent):void 0},o=function(n){var o=r(n);return o?t[o]:e},l=function(e){var n=r(e);n&&delete t[n]};return{getContainerId:r,getContainer:o,setContainer:n,removeContainer:l}}]),angular.module("duScroll.smoothScroll",["duScroll.scrollHelpers","duScroll.scrollContainerAPI"]).directive("duSmoothScroll",["duScrollDuration","duScrollOffset","scrollContainerAPI",function(e,t,n){"use strict";return{link:function(r,o,l){o.on("click",function(o){if(l.href&&-1!==l.href.indexOf("#")){var i=document.getElementById(l.href.replace(/.*(?=#[^\s]+$)/,"").substring(1));if(i&&i.getBoundingClientRect){o.stopPropagation&&o.stopPropagation(),o.preventDefault&&o.preventDefault();var u=l.offset?parseInt(l.offset,10):t,c=l.duration?parseInt(l.duration,10):e,a=n.getContainer(r);a.scrollToElement(angular.element(i),isNaN(u)?0:u,isNaN(c)?0:c)}}})}}}]),angular.module("duScroll.spyContext",["duScroll.spyAPI"]).directive("duSpyContext",["spyAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t){e.createContext(t)}}}}}]),angular.module("duScroll.scrollContainer",["duScroll.scrollContainerAPI"]).directive("duScrollContainer",["scrollContainerAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(){return{pre:function(t,n,r){r.$observe("duScrollContainer",function(r){angular.isString(r)&&(r=document.getElementById(r)),r=angular.isElement(r)?angular.element(r):n,e.setContainer(t,r),t.$on("$destroy",function(){e.removeContainer(t)})})}}}}}]),angular.module("duScroll.scrollspy",["duScroll.spyAPI"]).directive("duScrollspy",["spyAPI","duScrollOffset","$timeout","$rootScope",function(e,t,n,r){"use strict";var o=function(e,t,n){angular.isElement(e)?this.target=e:angular.isString(e)&&(this.targetId=e),this.$element=t,this.offset=n};return o.prototype.getTargetElement=function(){return!this.target&&this.targetId&&(this.target=document.getElementById(this.targetId)),this.target},o.prototype.getTargetPosition=function(){var e=this.getTargetElement();return e?e.getBoundingClientRect():void 0},o.prototype.flushTargetCache=function(){this.targetId&&(this.target=void 0)},{link:function(l,i,u){var c,a=u.ngHref||u.href;a&&-1!==a.indexOf("#")?c=a.replace(/.*(?=#[^\s]+$)/,"").substring(1):u.duScrollspy&&(c=u.duScrollspy),c&&n(function(){var n=new o(c,i,-(u.offset?parseInt(u.offset,10):t));e.addSpy(n),l.$on("$destroy",function(){e.removeSpy(n)}),l.$on("$locationChangeSuccess",n.flushTargetCache.bind(n)),r.$on("$stateChangeSuccess",n.flushTargetCache.bind(n))},0,!1)}}}]);

},{}],47:[function(require,module,exports){
require('./angular-route.js');
require('./angular-animate.min.js');
require('./angular-sanitize.js');
require('./angular-scroll.min.js');

require('./angular.infinitescroll.js');
require('./angular.datetimepicker.js');
require('./angular-advanced-searchbox-tpls.js');
require('./angular-local-storage.js');

require('./angular-date-time.js');
require('./angular.sticky.js');
require('./angular-file-upload.js');



/*
window.rangy = require('./../../../../node_modules/rangy/lib/rangy-core.js');
window.rangy.saveSelection = require('./../../../../node_modules/rangy/lib/rangy-selectionsaverestore.js');
require('./../../../../node_modules/textangular/dist/textAngular-rangy.min.js');
require('./../../../../node_modules/textangular/dist/textAngular-sanitize.min.js');
require('./../../../../node_modules/textangular/dist/textAngular.min.js');
*/
},{"./angular-advanced-searchbox-tpls.js":38,"./angular-animate.min.js":39,"./angular-date-time.js":40,"./angular-file-upload.js":41,"./angular-local-storage.js":43,"./angular-route.js":44,"./angular-sanitize.js":45,"./angular-scroll.min.js":46,"./angular.datetimepicker.js":48,"./angular.infinitescroll.js":49,"./angular.sticky.js":51}],48:[function(require,module,exports){
angular.module('ui.bootstrap.datetimepicker',
    ["ui.bootstrap.dateparser", "ui.bootstrap.datepicker", "ui.bootstrap.timepicker"]
  )
  .directive('datepickerPopup', function (){
   return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
    }
   }
  })
  .directive('datetimepicker', [
    function() {
      if (angular.version.full < '1.1.4') {
        return {
          restrict: 'EA',
          template: "<div class=\"alert alert-danger\">Angular 1.1.4 or above is required for datetimepicker to work correctly</div>"
        };
      }
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          ngModel: '=',
          dayFormat: "=",
          monthFormat: "=",
          yearFormat: "=",
          dayHeaderFormat: "=",
          dayTitleFormat: "=",
          monthTitleFormat: "=",
          showWeeks: "=",
          startingDay: "=",
          yearRange: "=",
          dateFormat: "=",
          minDate: "=",
          maxDate: "=",
          dateOptions: "=",
          dateDisabled: "&",
          hourStep: "=",
          minuteStep: "=",
          showMeridian: "=",
          meredians: "=",
          mousewheel: "=",
          placeholder: "=",
          readonlyTime: "@",
          ngDisabled: "="
        },
        template: function(elem, attrs) {
          function dashCase(name, separator) {
            return name.replace(/[A-Z]/g, function(letter, pos) {
              return (pos ? '-' : '') + letter.toLowerCase();
            });
          }

          function createAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + "=\"" + dateTimeAttr + "\" ";
            } else {
              return '';
            }
          }

          function createFuncAttr(innerAttr, funcArgs, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + "=\"" + dateTimeAttr + "({" + funcArgs + "})\" ";
            } else {
              return '';
            }
          }

          function createEvalAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + "=\"" + attrs[dateTimeAttr] + "\" ";
            } else {
              return dashCase(innerAttr);
            }
          }

          function createAttrConcat(previousAttrs, attr) {
            return previousAttrs + createAttr.apply(null, attr)
          }
          var tmpl = "<div class=\"datetimepicker-wrapper\">" +
            "<input class=\"form-control\" type=\"text\" " +
              "ng-click=\"open($event)\" " +
              "ng-change=\"date_change($event)\" " +
              "is-open=\"opened\" " +
              "ng-model=\"ngModel\" " + [
              ["minDate"],
              ["maxDate"],
              ["dayFormat"],
              ["monthFormat"],
              ["yearFormat"],
              ["dayHeaderFormat"],
              ["dayTitleFormat"],
              ["monthTitleFormat"],
              ["startingDay"],
              ["yearRange"],
              ["datepickerOptions", "dateOptions"],
              ["ngDisabled"]
          ].reduce(createAttrConcat, '') +
            createFuncAttr("dateDisabled", "date: date, mode: mode") +
            createEvalAttr("datepickerPopup", "dateFormat") +
            createEvalAttr("placeholder", "placeholder") +
            "/>\n" +
            "</div>\n" +
            "<div class=\"datetimepicker-wrapper\" ng-model=\"time\" ng-change=\"time_change()\" style=\"display:inline-block\">\n" +
            "<timepicker " + [
              ["hourStep"],
              ["minuteStep"],
              ["showMeridian"],
              ["meredians"],
              ["mousewheel"]
          ].reduce(createAttrConcat, '') +
            createEvalAttr("readonlyInput", "readonlyTime") +
            "></timepicker>\n" +
            "</div>";
          return tmpl;
        },
        controller: ['$scope',
          function($scope) {
            $scope.date_change = function() {
              // If we changed the date only, set the time (h,m) on it.
              // This is important in case the previous date was null.
              // This solves the issue when the user set a date and time, cleared the date, and chose another date,
              // and then, the time was cleared too - which is unexpected
              var time = $scope.time;
              if ($scope.ngModel) { // if this is null, that's because the user cleared the date field
                $scope.ngModel.setHours(time.getHours(), time.getMinutes(), 0, 0);
              }
            };

            $scope.time_change = function() {
              if ($scope.ngModel && $scope.time) {
                // convert from ISO format to Date
                if (typeof $scope.ngModel === "string" || typeof $scope.ngModel == "number") $scope.ngModel = new Date($scope.ngModel);
                $scope.ngModel.setHours($scope.time.getHours(), $scope.time.getMinutes(), 0, 0);
              }
            };
            $scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.opened = true;
            };
          }
        ],
        link: function(scope, element) {
          var firstTimeAssign = true;

          scope.$watch(function() {
            return scope.ngModel;
          }, function(newTime) {
            // if a time element is focused, updating its model will cause hours/minutes to be formatted by padding with leading zeros
            if (!element.children()[1].contains(document.activeElement)) {

              if (newTime == null || newTime === '') { // if the newTime is not defined
                if (firstTimeAssign) { // if it's the first time we assign the time value
                  // create a new default time where the hours, minutes, seconds and milliseconds are set to 0.
                  newTime = new Date();
                  newTime.setHours(0, 0, 0, 0);
                } else { // just leave the time unchanged
                  return;
                }
              }

              if (!(newTime instanceof Date)) { // if the ngModel was not a Date, convert it
                newTime = new Date(newTime);
              }

              scope.time = newTime; // change the time
              if (firstTimeAssign) {
                firstTimeAssign = false;
              }
            }
          }, true);
        }
      }
    }
  ]);
},{}],49:[function(require,module,exports){
/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);

},{}],50:[function(require,module,exports){
/*
 AngularJS v1.3.0-beta.5
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(O,U,s){'use strict';function v(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.3.0-beta.5/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function db(b){if(null==b||Da(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:t(b)||M(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(P(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(db(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Tb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function ad(b,
a,c){for(var d=Tb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Ub(b){return function(a,c){b(c,a)}}function eb(){for(var b=ka.length,a;b;){b--;a=ka[b].charCodeAt(0);if(57==a)return ka[b]="A",ka.join("");if(90==a)ka[b]="0";else return ka[b]=String.fromCharCode(a+1),ka.join("")}ka.unshift("0");return ka.join("")}function Vb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function A(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Vb(b,a);return b}function Y(b){return parseInt(b,
10)}function Wb(b,a){return A(new (A(function(){},{prototype:b})),a)}function C(){}function Ea(b){return b}function aa(b){return function(){return b}}function D(b){return"undefined"===typeof b}function B(b){return"undefined"!==typeof b}function X(b){return null!=b&&"object"===typeof b}function t(b){return"string"===typeof b}function Ab(b){return"number"===typeof b}function ra(b){return"[object Date]"===ya.call(b)}function M(b){return"[object Array]"===ya.call(b)}function P(b){return"function"===typeof b}
function fb(b){return"[object RegExp]"===ya.call(b)}function Da(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function bd(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function cd(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function gb(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Fa(b,a){var c=gb(b,a);0<=c&&b.splice(c,1);return a}function ba(b,a){if(Da(b)||b&&b.$evalAsync&&b.$watch)throw Oa("cpws");
if(a){if(b===a)throw Oa("cpi");if(M(b))for(var c=a.length=0;c<b.length;c++)a.push(ba(b[c]));else{c=a.$$hashKey;q(a,function(b,c){delete a[c]});for(var d in b)a[d]=ba(b[d]);Vb(a,c)}}else(a=b)&&(M(b)?a=ba(b,[]):ra(b)?a=new Date(b.getTime()):fb(b)?a=RegExp(b.source):X(b)&&(a=ba(b,{})));return a}function Xb(b,a){a=a||{};for(var c in b)!b.hasOwnProperty(c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a}function za(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;
var c=typeof b,d;if(c==typeof a&&"object"==c)if(M(b)){if(!M(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!za(b[d],a[d]))return!1;return!0}}else{if(ra(b))return ra(a)&&b.getTime()==a.getTime();if(fb(b)&&fb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||Da(b)||Da(a)||M(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!P(b[d])){if(!za(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==s&&!P(a[d]))return!1;
return!0}return!1}function Yb(){return U.securityPolicy&&U.securityPolicy.isActive||U.querySelector&&!(!U.querySelector("[ng-csp]")&&!U.querySelector("[data-ng-csp]"))}function hb(b,a){var c=2<arguments.length?sa.call(arguments,2):[];return!P(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(sa.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function dd(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=
s:Da(a)?c="$WINDOW":a&&U===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function ta(b,a){return"undefined"===typeof b?s:JSON.stringify(b,dd,a?"  ":null)}function Zb(b){return t(b)?JSON.parse(b):b}function Pa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=I(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ha(b){b=y(b).clone();try{b.empty()}catch(a){}var c=y("<div>").append(b).html();try{return 3===b[0].nodeType?I(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
function(a,b){return"<"+I(b)})}catch(d){return I(c)}}function $b(b){try{return decodeURIComponent(b)}catch(a){}}function ac(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=$b(c[0]),B(d)&&(b=B(c[1])?$b(c[1]):!0,a[d]?M(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function bc(b){var a=[];q(b,function(b,d){M(b)?q(b,function(b){a.push(Aa(d,!0)+(!0===b?"":"="+Aa(b,!0)))}):a.push(Aa(d,!0)+(!0===b?"":"="+Aa(b,!0)))});return a.length?a.join("&"):""}function Bb(b){return Aa(b,
!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function Aa(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function ed(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(U.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+
a+"\\:"),c),q(b.querySelectorAll("["+a+"]"),c))});q(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function cc(b,a){var c=function(){b=y(b);if(b.injector()){var c=b[0]===U?"document":ha(b);throw Oa("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=dc(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",
function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(O&&!d.test(O.name))return c();O.name=O.name.replace(d,"");Qa.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function ib(b,a){a=a||"_";return b.replace(fd,function(b,d){return(d?a:"")+b.toLowerCase()})}function Cb(b,a,c){if(!b)throw Oa("areq",a||"?",c||"required");return b}function Ra(b,a,c){c&&M(b)&&(b=b[b.length-1]);Cb(P(b),a,"not a function, got "+(b&&"object"==typeof b?
b.constructor.name||"Object":typeof b));return b}function Ba(b,a){if("hasOwnProperty"===b)throw Oa("badname",a);}function ec(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&P(b)?hb(e,b):b}function Db(b){var a=b[0];b=b[b.length-1];if(a===b)return y(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return y(c)}function gd(b){var a=v("$injector"),c=v("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||v;return b.module||
(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],l=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide",
"constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};f&&l(f);return n}())}}())}function hd(b){A(b,{bootstrap:cc,copy:ba,extend:A,equals:za,element:y,forEach:q,injector:dc,noop:C,bind:hb,toJson:ta,fromJson:Zb,identity:Ea,isUndefined:D,isDefined:B,isString:t,isFunction:P,isObject:X,isNumber:Ab,isElement:bd,isArray:M,
version:id,isDate:ra,lowercase:I,uppercase:Ga,callbacks:{counter:0},$$minErr:v,$$csp:Yb});Sa=gd(O);try{Sa("ngLocale")}catch(a){Sa("ngLocale",[]).provider("$locale",jd)}Sa("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:kd});a.provider("$compile",fc).directive({a:ld,input:gc,textarea:gc,form:md,script:nd,select:od,style:pd,option:qd,ngBind:rd,ngBindHtml:sd,ngBindTemplate:td,ngClass:ud,ngClassEven:vd,ngClassOdd:wd,ngCloak:xd,ngController:yd,ngForm:zd,ngHide:Ad,ngIf:Bd,ngInclude:Cd,
ngInit:Dd,ngNonBindable:Ed,ngPluralize:Fd,ngRepeat:Gd,ngShow:Hd,ngStyle:Id,ngSwitch:Jd,ngSwitchWhen:Kd,ngSwitchDefault:Ld,ngOptions:Md,ngTransclude:Nd,ngModel:Od,ngList:Pd,ngChange:Qd,required:hc,ngRequired:hc,ngValue:Rd}).directive({ngInclude:Sd}).directive(Eb).directive(ic);a.provider({$anchorScroll:Td,$animate:Ud,$browser:Vd,$cacheFactory:Wd,$controller:Xd,$document:Yd,$exceptionHandler:Zd,$filter:jc,$interpolate:$d,$interval:ae,$http:be,$httpBackend:ce,$location:de,$log:ee,$parse:fe,$rootScope:ge,
$q:he,$sce:ie,$sceDelegate:je,$sniffer:ke,$templateCache:le,$timeout:me,$window:ne,$$rAF:oe,$$asyncCallback:pe})}])}function Ta(b){return b.replace(qe,function(a,b,d,e){return e?d.toUpperCase():d}).replace(re,"Moz$1")}function Fb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,k,l,n,p,r,u;if(!d||null!=b)for(;e.length;)for(k=e.shift(),l=0,n=k.length;l<n;l++)for(p=y(k[l]),m?p.triggerHandler("$destroy"):m=!m,r=0,p=(u=p.children()).length;r<p;r++)e.push(Ha(u[r]));return g.apply(this,arguments)}
var g=Ha.fn[b],g=g.$original||g;e.$original=g;Ha.fn[b]=e}function se(b,a){var c,d,e=a.createDocumentFragment(),g=[];if(Gb.test(b)){c=c||e.appendChild(a.createElement("div"));d=(te.exec(b)||["",""])[1].toLowerCase();d=ea[d]||ea._default;c.innerHTML=d[1]+b.replace(ue,"<$1></$2>")+d[2];for(d=d[0];d--;)c=c.lastChild;g=g.concat(sa.call(c.childNodes,void 0));c=e.firstChild;c.textContent=""}else g.push(a.createTextNode(b));e.textContent="";e.innerHTML="";q(g,function(a){e.appendChild(a)});return e}function N(b){if(b instanceof
N)return b;t(b)&&(b=ca(b));if(!(this instanceof N)){if(t(b)&&"<"!=b.charAt(0))throw Hb("nosel");return new N(b)}if(t(b)){var a;a=U;var c;b=(c=ve.exec(b))?[a.createElement(c[1])]:(c=se(b,a))?c.childNodes:[]}kc(this,b)}function Ib(b){return b.cloneNode(!0)}function Ia(b){lc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ia(b[a])}function mc(b,a,c,d){if(B(d))throw Hb("offargs");var e=la(b,"events");la(b,"handle")&&(D(a)?q(e,function(a,c){Ua(b,c,a);delete e[c]}):q(a.split(" "),function(a){D(c)?(Ua(b,
a,e[a]),delete e[a]):Fa(e[a]||[],c)}))}function lc(b,a){var c=b[jb],d=Va[c];d&&(a?delete Va[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),mc(b)),delete Va[c],b[jb]=s))}function la(b,a,c){var d=b[jb],d=Va[d||-1];if(B(c))d||(b[jb]=d=++we,d=Va[d]={}),d[a]=c;else return d&&d[a]}function nc(b,a,c){var d=la(b,"data"),e=B(c),g=!e&&B(a),f=g&&!X(a);d||f||la(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];A(d,a)}else return d}function Jb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||
"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function kb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",ca((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+ca(a)+" "," ")))})}function lb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=ca(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",ca(c))}}function kc(b,a){if(a){a=a.nodeName||!B(a.length)||
Da(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function oc(b,a){return mb(b,"$"+(a||"ngController")+"Controller")}function mb(b,a,c){b=y(b);9==b[0].nodeType&&(b=b.find("html"));for(a=M(a)?a:[a];b.length;){for(var d=b[0],e=0,g=a.length;e<g;e++)if((c=b.data(a[e]))!==s)return c;b=y(d.parentNode||11===d.nodeType&&d.host)}}function pc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ia(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function qc(b,a){var c=nb[a.toLowerCase()];return c&&rc[b.nodeName]&&
c}function xe(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||U);if(D(c.defaultPrevented)){var g=c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=Xb(a[e||c.type]||[]);q(f,function(a){a.call(b,c)});8>=T?(c.preventDefault=
null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ja(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===s&&(c=b.$$hashKey=eb()):c=b;return a+":"+c}function Wa(b){q(b,this.put,this)}function sc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(ye,""),c=c.match(ze),q(c[1].split(Ae),function(b){b.replace(Be,function(b,
c,d){a.push(d)})})),b.$inject=a):M(b)?(c=b.length-1,Ra(b[c],"fn"),a=b.slice(0,c)):Ra(b,"fn",!0);return a}function dc(b){function a(a){return function(b,c){if(X(b))q(b,Ub(a));else return a(b,c)}}function c(a,b){Ba(a,"service");if(P(b)||M(b))b=n.instantiate(b);if(!b.$get)throw Xa("pget",a);return l[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,h;q(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(t(a))for(c=Sa(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,
g=0,h=d.length;g<h;g++){var f=d[g],m=n.get(f[0]);m[f[1]].apply(m,f[2])}else P(a)?b.push(n.invoke(a)):M(a)?b.push(n.invoke(a)):Ra(a,"module")}catch(l){throw M(a)&&(a=a[a.length-1]),l.message&&(l.stack&&-1==l.stack.indexOf(l.message))&&(l=l.message+"\n"+l.stack),Xa("modulerr",a,l.stack||l.message||l);}}});return b}function g(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Xa("cdep",m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=f,a[d]=b(d)}catch(e){throw a[d]===f&&delete a[d],
e;}finally{m.shift()}}function d(a,b,e){var g=[],h=sc(a),f,m,k;m=0;for(f=h.length;m<f;m++){k=h[m];if("string"!==typeof k)throw Xa("itkn",k);g.push(e&&e.hasOwnProperty(k)?e[k]:c(k))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(M(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return X(e)||P(e)?e:c},get:c,annotate:sc,has:function(b){return l.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var f={},h="Provider",m=[],k=new Wa,l={$provide:{provider:a(c),
factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,aa(b))}),constant:a(function(a,b){Ba(a,"constant");l[a]=b;p[a]=b}),decorator:function(a,b){var c=n.get(a+h),d=c.$get;c.$get=function(){var a=r.invoke(d,c);return r.invoke(b,null,{$delegate:a})}}}},n=l.$injector=g(l,function(){throw Xa("unpr",m.join(" <- "));}),p={},r=p.$injector=g(p,function(a){a=n.get(a+h);return r.invoke(a.$get,a)});q(e(b),function(a){r.invoke(a||
C)});return r}function Td(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==I(a.nodeName)||(b=a)});return b}function g(){var b=c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(g)});return g}]}function pe(){this.$get=
["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function Ce(b,a,c,d){function e(a){try{a.apply(null,sa.call(arguments,1))}finally{if(u--,0===u)for(;z.length;)try{z.pop()()}catch(b){c.error(b)}}}function g(a,b){(function S(){q(K,function(a){a()});w=b(S,a)})()}function f(){x=null;H!=h.url()&&(H=h.url(),q(ma,function(a){a(h.url())}))}var h=this,m=a[0],k=b.location,l=b.history,n=b.setTimeout,p=b.clearTimeout,r={};h.isMock=!1;var u=0,z=[];h.$$completeOutstandingRequest=
e;h.$$incOutstandingRequestCount=function(){u++};h.notifyWhenNoOutstandingRequests=function(a){q(K,function(a){a()});0===u?a():z.push(a)};var K=[],w;h.addPollFn=function(a){D(w)&&g(100,n);K.push(a);return a};var H=k.href,G=a.find("base"),x=null;h.url=function(a,c){k!==b.location&&(k=b.location);l!==b.history&&(l=b.history);if(a){if(H!=a)return H=a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),G.attr("href",G.attr("href"))):(x=a,c?k.replace(a):k.href=a),h}else return x||k.href.replace(/%27/g,
"'")};var ma=[],L=!1;h.onUrlChange=function(a){if(!L){if(d.history)y(b).on("popstate",f);if(d.hashchange)y(b).on("hashchange",f);else h.addPollFn(f);L=!0}ma.push(a);return a};h.baseHref=function(){var a=G.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var Q={},da="",E=h.baseHref();h.cookies=function(a,b){var d,e,g,h;if(a)b===s?m.cookie=escape(a)+"=;path="+E+";expires=Thu, 01 Jan 1970 00:00:00 GMT":t(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+E).length+1,4096<d&&c.warn("Cookie '"+
a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==da)for(da=m.cookie,d=da.split("; "),Q={},g=0;g<d.length;g++)e=d[g],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),Q[a]===s&&(Q[a]=unescape(e.substring(h+1))));return Q}};h.defer=function(a,b){var c;u++;c=n(function(){delete r[c];e(a)},b||0);r[c]=!0;return c};h.defer.cancel=function(a){return r[a]?(delete r[a],p(a),e(C),!0):!1}}function Vd(){this.$get=["$window","$log","$sniffer","$document",
function(b,a,c,d){return new Ce(b,d,a,c)}]}function Wd(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw v("$cacheFactory")("iid",b);var f=0,h=A({},d,{id:b}),m={},k=d&&d.capacity||Number.MAX_VALUE,l={},n=null,p=null;return a[b]={put:function(a,b){if(k<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!D(b))return a in m||f++,m[a]=b,f>k&&this.remove(p.key),b},get:function(a){if(k<
Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return m[a]},remove:function(a){if(k<Number.MAX_VALUE){var b=l[a];if(!b)return;b==n&&(n=b.p);b==p&&(p=b.n);g(b.n,b.p);delete l[a]}delete m[a];f--},removeAll:function(){m={};f=0;l={};n=p=null},destroy:function(){l=h=m=null;delete a[b]},info:function(){return A({},h,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function le(){this.$get=["$cacheFactory",function(b){return b("templates")}]}
function fc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,g=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function m(a,e){Ba(a,"directive");t(a)?(Cb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);P(f)?f={compile:aa(f)}:!f.compile&&f.link&&(f.compile=aa(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||
f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(m){d(m)}});return e}])),c[a].push(e)):q(a,Ub(m));return this};this.aHrefSanitizationWhitelist=function(b){return B(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope",
"$document","$sce","$animate","$$sanitizeUri",function(a,b,l,n,p,r,u,z,K,w,H,G){function x(a,b,c,d,e){a instanceof y||(a=y(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=y(b).wrap("<span></span>").parent()[0])});var g=L(a,b,a,c,d,e);ma(a,"ng-scope");return function(b,c,d){Cb(b,"scope");var e=c?Ka.clone.call(a):a;q(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var f=e.length;d<f;d++){var m=e[d].nodeType;1!==m&&9!==m||e.eq(d).data("$scope",b)}c&&c(e,b);g&&g(b,e,e);return e}}
function ma(a,b){try{a.addClass(b)}catch(c){}}function L(a,b,c,d,e,g){function f(a,c,d,e){var g,k,l,n,r,p,u;g=c.length;var J=Array(g);for(r=0;r<g;r++)J[r]=c[r];u=r=0;for(p=m.length;r<p;u++)k=J[u],c=m[r++],g=m[r++],l=y(k),c?(c.scope?(n=a.$new(),l.data("$scope",n)):n=a,(l=c.transclude)||!e&&b?c(g,n,k,d,Q(a,l||b)):c(g,n,k,d,e)):g&&g(a,k.childNodes,s,e)}for(var m=[],k,l,n,r,p=0;p<a.length;p++)k=new Kb,l=da(a[p],[],k,0===p?d:s,e),(g=l.length?ia(l,a[p],k,b,c,null,[],[],g):null)&&g.scope&&ma(y(a[p]),"ng-scope"),
k=g&&g.terminal||!(n=a[p].childNodes)||!n.length?null:L(n,g?g.transclude:b),m.push(g,k),r=r||g||k,g=null;return r?f:null}function Q(a,b){return function(c,d,e){var g=!1;c||(c=a.$new(),g=c.$$transcluded=!0);d=b(c,d,e);if(g)d.on("$destroy",hb(c,c.$destroy));return d}}function da(a,b,c,d,f){var m=c.$attr,k;switch(a.nodeType){case 1:S(b,na(La(a).toLowerCase()),"E",d,f);var l,n,r;k=a.attributes;for(var p=0,u=k&&k.length;p<u;p++){var z=!1,K=!1;l=k[p];if(!T||8<=T||l.specified){n=l.name;r=na(n);W.test(r)&&
(n=ib(r.substr(6),"-"));var H=r.replace(/(Start|End)$/,"");r===H+"Start"&&(z=n,K=n.substr(0,n.length-5)+"end",n=n.substr(0,n.length-6));r=na(n.toLowerCase());m[r]=n;c[r]=l=ca(l.value);qc(a,r)&&(c[r]=!0);N(a,b,l,r);S(b,r,"A",d,f,z,K)}}a=a.className;if(t(a)&&""!==a)for(;k=g.exec(a);)r=na(k[2]),S(b,r,"C",d,f)&&(c[r]=ca(k[3])),a=a.substr(k.index+k[0].length);break;case 3:v(b,a.nodeValue);break;case 8:try{if(k=e.exec(a.nodeValue))r=na(k[1]),S(b,r,"M",d,f)&&(c[r]=ca(k[2]))}catch(x){}}b.sort(D);return b}
function E(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ja("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return y(d)}function R(a,b,c){return function(d,e,g,f,k){e=E(e[0],b,c);return a(d,e,g,f,k)}}function ia(a,c,d,e,g,f,m,n,p){function z(a,b,c,d){if(a){c&&(a=R(a,c,d));a.require=F.require;if(Q===F||F.$$isolateScope)a=uc(a,{isolateScope:!0});m.push(a)}if(b){c&&(b=R(b,c,d));b.require=F.require;
if(Q===F||F.$$isolateScope)b=uc(b,{isolateScope:!0});n.push(b)}}function K(a,b,c){var d,e="data",g=!1;if(t(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),g=g||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||b[e]("$"+a+"Controller");if(!d&&!g)throw ja("ctreq",a,v);}else M(a)&&(d=[],q(a,function(a){d.push(K(a,b,c))}));return d}function H(a,e,g,f,p){function z(a,b){var c;2>arguments.length&&(b=a,a=s);A&&(c=da);return p(a,b,c)}var J,x,w,G,R,E,da={},ob;J=c===g?d:Xb(d,new Kb(y(g),
d.$attr));x=J.$$element;if(Q){var S=/^\s*([@=&])(\??)\s*(\w*)\s*$/;f=y(g);E=e.$new(!0);ia&&ia===Q.$$originalDirective?f.data("$isolateScope",E):f.data("$isolateScopeNoTemplate",E);ma(f,"ng-isolate-scope");q(Q.scope,function(a,c){var d=a.match(S)||[],g=d[3]||c,f="?"==d[2],d=d[1],m,l,n,p;E.$$isolateBindings[c]=d+g;switch(d){case "@":J.$observe(g,function(a){E[c]=a});J.$$observers[g].$$scope=e;J[g]&&(E[c]=b(J[g])(e));break;case "=":if(f&&!J[g])break;l=r(J[g]);p=l.literal?za:function(a,b){return a===
b};n=l.assign||function(){m=E[c]=l(e);throw ja("nonassign",J[g],Q.name);};m=E[c]=l(e);E.$watch(function(){var a=l(e);p(a,E[c])||(p(a,m)?n(e,a=E[c]):E[c]=a);return m=a},null,l.literal);break;case "&":l=r(J[g]);E[c]=function(a){return l(e,a)};break;default:throw ja("iscp",Q.name,c,a);}})}ob=p&&z;L&&q(L,function(a){var b={$scope:a===Q||a.$$isolateScope?E:e,$element:x,$attrs:J,$transclude:ob},c;R=a.controller;"@"==R&&(R=J[a.name]);c=u(R,b);da[a.name]=c;A||x.data("$"+a.name+"Controller",c);a.controllerAs&&
(b.$scope[a.controllerAs]=c)});f=0;for(w=m.length;f<w;f++)try{G=m[f],G(G.isolateScope?E:e,x,J,G.require&&K(G.require,x,da),ob)}catch(F){l(F,ha(x))}f=e;Q&&(Q.template||null===Q.templateUrl)&&(f=E);a&&a(f,g.childNodes,s,p);for(f=n.length-1;0<=f;f--)try{G=n[f],G(G.isolateScope?E:e,x,J,G.require&&K(G.require,x,da),ob)}catch(B){l(B,ha(x))}}p=p||{};for(var w=-Number.MAX_VALUE,G,L=p.controllerDirectives,Q=p.newIsolateScopeDirective,ia=p.templateDirective,S=p.nonTlbTranscludeDirective,D=!1,A=p.hasElementTranscludeDirective,
Z=d.$$element=y(c),F,v,V,Ya=e,O,N=0,oa=a.length;N<oa;N++){F=a[N];var T=F.$$start,W=F.$$end;T&&(Z=E(c,T,W));V=s;if(w>F.priority)break;if(V=F.scope)G=G||F,F.templateUrl||(I("new/isolated scope",Q,F,Z),X(V)&&(Q=F));v=F.name;!F.templateUrl&&F.controller&&(V=F.controller,L=L||{},I("'"+v+"' controller",L[v],F,Z),L[v]=F);if(V=F.transclude)D=!0,F.$$tlb||(I("transclusion",S,F,Z),S=F),"element"==V?(A=!0,w=F.priority,V=E(c,T,W),Z=d.$$element=y(U.createComment(" "+v+": "+d[v]+" ")),c=Z[0],pb(g,y(sa.call(V,0)),
c),Ya=x(V,e,w,f&&f.name,{nonTlbTranscludeDirective:S})):(V=y(Ib(c)).contents(),Z.empty(),Ya=x(V,e));if(F.template)if(I("template",ia,F,Z),ia=F,V=P(F.template)?F.template(Z,d):F.template,V=Y(V),F.replace){f=F;V=Gb.test(V)?y(V):[];c=V[0];if(1!=V.length||1!==c.nodeType)throw ja("tplrt",v,"");pb(g,Z,c);oa={$attr:{}};V=da(c,[],oa);var $=a.splice(N+1,a.length-(N+1));Q&&tc(V);a=a.concat(V).concat($);B(d,oa);oa=a.length}else Z.html(V);if(F.templateUrl)I("template",ia,F,Z),ia=F,F.replace&&(f=F),H=C(a.splice(N,
a.length-N),Z,d,g,Ya,m,n,{controllerDirectives:L,newIsolateScopeDirective:Q,templateDirective:ia,nonTlbTranscludeDirective:S}),oa=a.length;else if(F.compile)try{O=F.compile(Z,d,Ya),P(O)?z(null,O,T,W):O&&z(O.pre,O.post,T,W)}catch(aa){l(aa,ha(Z))}F.terminal&&(H.terminal=!0,w=Math.max(w,F.priority))}H.scope=G&&!0===G.scope;H.transclude=D&&Ya;p.hasElementTranscludeDirective=A;return H}function tc(a){for(var b=0,c=a.length;b<c;b++)a[b]=Wb(a[b],{$$isolateScope:!0})}function S(b,e,g,f,k,n,r){if(e===k)return null;
k=null;if(c.hasOwnProperty(e)){var p;e=a.get(e+d);for(var u=0,z=e.length;u<z;u++)try{p=e[u],(f===s||f>p.priority)&&-1!=p.restrict.indexOf(g)&&(n&&(p=Wb(p,{$$start:n,$$end:r})),b.push(p),k=p)}catch(K){l(K)}}return k}function B(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?(ma(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=
(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function C(a,b,c,d,e,g,f,k){var m=[],l,r,u=b[0],z=a.shift(),K=A({},z,{templateUrl:null,transclude:null,replace:null,$$originalDirective:z}),x=P(z.templateUrl)?z.templateUrl(b,c):z.templateUrl;b.empty();n.get(w.getTrustedResourceUrl(x),{cache:p}).success(function(n){var p,H;n=Y(n);if(z.replace){n=Gb.test(n)?y(n):[];p=n[0];if(1!=n.length||1!==p.nodeType)throw ja("tplrt",z.name,x);n={$attr:{}};pb(d,b,p);var w=da(p,
[],n);X(z.scope)&&tc(w);a=w.concat(a);B(c,n)}else p=u,b.html(n);a.unshift(K);l=ia(a,p,c,e,b,z,g,f,k);q(d,function(a,c){a==p&&(d[c]=b[0])});for(r=L(b[0].childNodes,e);m.length;){n=m.shift();H=m.shift();var G=m.shift(),R=m.shift(),w=b[0];if(H!==u){var E=H.className;k.hasElementTranscludeDirective&&z.replace||(w=Ib(p));pb(G,y(H),w);ma(y(w),E)}H=l.transclude?Q(n,l.transclude):R;l(r,n,w,d,H)}m=null}).error(function(a,b,c,d){throw ja("tpload",d.url);});return function(a,b,c,d,e){m?(m.push(b),m.push(c),
m.push(d),m.push(e)):l(r,b,c,d,e)}}function D(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function I(a,b,c,d){if(b)throw ja("multidir",b.name,c.name,a,ha(d));}function v(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:aa(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);ma(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function O(a,b){if("srcdoc"==b)return w.HTML;var c=La(a);if("xlinkHref"==b||
"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return w.RESOURCE_URL}function N(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===La(a))throw ja("selmulti",ha(a));c.push({priority:100,compile:function(){return{pre:function(c,d,m){d=m.$$observers||(m.$$observers={});if(f.test(e))throw ja("nodomevents");if(g=b(m[e],!0,O(a,e)))m[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(m.$$observers&&m.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===e&&a!=b?m.$updateClass(a,b):m.$set(e,a)})}}}})}}
function pb(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,m;if(a)for(f=0,m=a.length;f<m;f++)if(a[f]==d){a[f++]=c;m=f+e-1;for(var k=a.length;f<k;f++,m++)m<k?a[f]=a[m]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=U.createDocumentFragment();a.appendChild(d);c[y.expando]=d[y.expando];d=1;for(e=b.length;d<e;d++)g=b[d],y(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function uc(a,b){return A(function(){return a.apply(null,arguments)},a,b)}var Kb=function(a,b){this.$$element=a;this.$attr=
b||{}};Kb.prototype={$normalize:na,$addClass:function(a){a&&0<a.length&&H.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&H.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=vc(a,b),d=vc(b,a);0===c.length?H.removeClass(this.$$element,d):0===d.length?H.addClass(this.$$element,c):H.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=qc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=ib(a,
"-"));e=La(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=G(b,"src"===a);!1!==c&&(null===b||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){l(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);z.$evalAsync(function(){e.$$inter||b(c[a])});return function(){Fa(e,b)}}};var Z=b.startSymbol(),oa=b.endSymbol(),Y="{{"==Z||"}}"==oa?Ea:function(a){return a.replace(/\{\{/g,
Z).replace(/}}/g,oa)},W=/^ngAttr[A-Z]/;return x}]}function na(b){return Ta(b.replace(De,""))}function vc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],h=0;h<e.length;h++)if(f==e[h])continue a;c+=(0<c.length?" ":"")+f}return c}function Xd(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Ba(a,"controller");X(a)?A(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,h,m;t(e)&&(f=e.match(a),h=f[1],m=f[3],e=
b.hasOwnProperty(h)?b[h]:ec(g.$scope,h,!0)||ec(d,h,!0),Ra(e,h,!0));f=c.instantiate(e,g);if(m){if(!g||"object"!=typeof g.$scope)throw v("$controller")("noscp",h||e.name,m);g.$scope[m]=f}return f}}]}function Yd(){this.$get=["$window",function(b){return y(b.document)}]}function Zd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function wc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=I(ca(b.substr(0,e)));d=ca(b.substr(e+1));c&&(a[c]=
a[c]?a[c]+(", "+d):d)});return a}function xc(b){var a=X(b)?b:s;return function(c){a||(a=wc(b));return c?a[I(c)]||null:a}}function yc(b,a,c){if(P(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function be(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){t(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Zb(d)));return d}],transformRequest:[function(a){return X(a)&&"[object File]"!==ya.call(a)&&
"[object Blob]"!==ya.call(a)?ta(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ba(d),put:ba(d),patch:ba(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,p){function r(a){function c(a){var b=A({},a,{data:yc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:n.reject(b)}var d={method:"get",
transformRequest:e.transformRequest,transformResponse:e.transformResponse},g=function(a){function b(a){var c;q(a,function(b,d){P(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=A({},a.headers),g,f,c=A({},c.common,c[I(a.method)]);b(c);b(d);a:for(g in c){a=I(g);for(f in d)if(I(f)===a)continue a;d[g]=c[g]}return d}(a);A(d,a);d.headers=g;d.method=Ga(d.method);(a=Lb(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:s)&&(g[d.xsrfHeaderName||e.xsrfHeaderName]=a);var f=[function(a){g=a.headers;
var b=yc(a.data,xc(g),a.transformRequest);D(a.data)&&q(g,function(a,b){"content-type"===I(b)&&delete g[b]});D(a.withCredentials)&&!D(e.withCredentials)&&(a.withCredentials=e.withCredentials);return u(a,b,g).then(c,c)},s],h=n.when(d);for(q(w,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var k=f.shift(),h=h.then(a,k)}h.success=function(a){h.then(function(b){a(b.data,b.status,b.headers,
d)});return h};h.error=function(a){h.then(null,function(b){a(b.data,b.status,b.headers,d)});return h};return h}function u(b,c,g){function f(a,b,c,e){w&&(200<=a&&300>a?w.put(s,[a,b,wc(c),e]):w.remove(s));m(b,a,c,e);d.$$phase||d.$apply()}function m(a,c,d,e){c=Math.max(c,0);(200<=c&&300>c?p.resolve:p.reject)({data:a,status:c,headers:xc(d),config:b,statusText:e})}function k(){var a=gb(r.pendingRequests,b);-1!==a&&r.pendingRequests.splice(a,1)}var p=n.defer(),u=p.promise,w,q,s=z(b.url,b.params);r.pendingRequests.push(b);
u.then(k,k);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(w=X(b.cache)?b.cache:X(e.cache)?e.cache:K);if(w)if(q=w.get(s),B(q)){if(q.then)return q.then(k,k),q;M(q)?m(q[1],q[0],ba(q[2]),q[3]):m(q,200,{},"OK")}else w.put(s,u);D(q)&&a(b.method,s,c,f,g,b.timeout,b.withCredentials,b.responseType);return u}function z(a,b){if(!b)return a;var c=[];ad(b,function(a,b){null===a||D(a)||(M(a)||(a=[a]),q(a,function(a){X(a)&&(a=ta(a));c.push(Aa(b)+"="+Aa(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+
c.join("&"));return a}var K=c("$http"),w=[];q(g,function(a){w.unshift(t(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=t(a)?p.get(a):p.invoke(a);w.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});r.pendingRequests=[];(function(a){q(arguments,function(a){r[a]=function(b,c){return r(A(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){r[a]=function(b,c,d){return r(A(d||{},{method:a,url:b,data:c}))}})})("post",
"put");r.defaults=e;return r}]}function Ee(b){if(8>=T&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!O.XMLHttpRequest))return new O.ActiveXObject("Microsoft.XMLHTTP");if(O.XMLHttpRequest)return new O.XMLHttpRequest;throw v("$httpBackend")("noxhr");}function ce(){this.$get=["$browser","$window","$document",function(b,a,c){return Fe(b,Ee,b.defer,a.angular.callbacks,c[0])}]}function Fe(b,a,c,d,e){function g(a,b,c){var g=e.createElement("script"),f=null;g.type="text/javascript";g.src=a;g.async=
!0;f=function(a){Ua(g,"load",f);Ua(g,"error",f);e.body.removeChild(g);g=null;var h=-1,u="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),u=a.type,h="error"===a.type?404:200);c&&c(h,u)};qb(g,"load",f);qb(g,"error",f);e.body.appendChild(g);return f}var f=-1;return function(e,m,k,l,n,p,r,u){function z(){w=f;G&&G();x&&x.abort()}function K(a,d,e,g,f){L&&c.cancel(L);G=x=null;0===d&&(d=e?200:"file"==ua(m).protocol?404:0);a(1223===d?204:d,e,g,f||"");b.$$completeOutstandingRequest(C)}var w;b.$$incOutstandingRequestCount();
m=m||b.url();if("jsonp"==I(e)){var H="_"+(d.counter++).toString(36);d[H]=function(a){d[H].data=a;d[H].called=!0};var G=g(m.replace("JSON_CALLBACK","angular.callbacks."+H),H,function(a,b){K(l,a,d[H].data,"",b);d[H]=C})}else{var x=a(e);x.open(e,m,!0);q(n,function(a,b){B(a)&&x.setRequestHeader(b,a)});x.onreadystatechange=function(){if(x&&4==x.readyState){var a=null,b=null;w!==f&&(a=x.getAllResponseHeaders(),b="response"in x?x.response:x.responseText);K(l,w||x.status,b,a,x.statusText||"")}};r&&(x.withCredentials=
!0);if(u)try{x.responseType=u}catch(s){if("json"!==u)throw s;}x.send(k||null)}if(0<p)var L=c(z,p);else p&&p.then&&p.then(z)}}function $d(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,k,l){for(var n,p,r=0,u=[],z=g.length,K=!1,w=[];r<z;)-1!=(n=g.indexOf(b,r))&&-1!=(p=g.indexOf(a,n+f))?(r!=n&&u.push(g.substring(r,n)),u.push(r=c(K=g.substring(n+f,p))),
r.exp=K,r=p+h,K=!0):(r!=z&&u.push(g.substring(r)),r=z);(z=u.length)||(u.push(""),z=1);if(l&&1<u.length)throw zc("noconcat",g);if(!k||K)return w.length=z,r=function(a){try{for(var b=0,c=z,f;b<c;b++)"function"==typeof(f=u[b])&&(f=f(a),f=l?e.getTrusted(l,f):e.valueOf(f),null===f||D(f)?f="":"string"!=typeof f&&(f=ta(f))),w[b]=f;return w.join("")}catch(h){a=zc("interr",g,h.toString()),d(a)}},r.exp=g,r.parts=u,r}var f=b.length,h=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};
return g}]}function ae(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,f,h,m){var k=a.setInterval,l=a.clearInterval,n=c.defer(),p=n.promise,r=0,u=B(m)&&!m;h=B(h)?h:0;p.then(null,null,d);p.$$intervalId=k(function(){n.notify(r++);0<h&&r>=h&&(n.resolve(r),l(p.$$intervalId),delete e[p.$$intervalId]);u||b.$apply()},f);e[p.$$intervalId]=n;return p}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],
!0):!1};return d}]}function jd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Ac(b){b=b.split("/");for(var a=b.length;a--;)b[a]=Bb(b[a]);return b.join("/")}function Bc(b,a,c){b=ua(b,c);a.$$protocol=
b.protocol;a.$$host=b.hostname;a.$$port=Y(b.port)||Ge[b.protocol]||null}function Cc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=ua(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=ac(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function pa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Za(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Mb(b){return b.substr(0,
Za(b).lastIndexOf("/")+1)}function Dc(b,a){this.$$html5=!0;a=a||"";var c=Mb(b);Bc(b,this,b);this.$$parse=function(a){var e=pa(c,a);if(!t(e))throw Nb("ipthprfx",a,c);Cc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=bc(this.$$search),b=this.$$hash?"#"+Bb(this.$$hash):"";this.$$url=Ac(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=pa(b,d))!==s)return d=e,(e=pa(a,e))!==s?c+(pa("/",e)||e):b+d;if((e=pa(c,
d))!==s)return c+e;if(c==d+"/")return c}}function Ob(b,a){var c=Mb(b);Bc(b,this,b);this.$$parse=function(d){var e=pa(b,d)||pa(c,d),e="#"==e.charAt(0)?pa(a,e):this.$$html5?e:"";if(!t(e))throw Nb("ihshprfx",d,a);Cc(e,this,b);d=this.$$path;var g=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=bc(this.$$search),e=this.$$hash?"#"+Bb(this.$$hash):"";this.$$url=Ac(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=
b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Za(b)==Za(a))return a}}function Ec(b,a){this.$$html5=!0;Ob.apply(this,arguments);var c=Mb(b);this.$$rewrite=function(d){var e;if(b==Za(d))return d;if(e=pa(c,d))return b+a+e;if(c===d+"/")return c}}function rb(b){return function(){return this[b]}}function Fc(b,a){return function(c){if(D(c))return this[b];this[b]=a(c);this.$$compose();return this}}function de(){var b="",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=
function(b){return B(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,m=d.baseHref(),k=d.url();a?(m=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(m||"/"),e=e.history?Dc:Ec):(m=Za(k),e=Ob);h=new e(m,"#"+b);h.$$parse(h.$$rewrite(k));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=y(a.target);"a"!==I(b[0].nodeName);)if(b[0]===g[0]||!(b=b.parent())[0])return;
var e=b.prop("href");X(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=ua(e.animVal).href);var f=h.$$rewrite(e);e&&(!b.attr("target")&&f&&!a.isDefaultPrevented())&&(a.preventDefault(),f!=d.url()&&(h.$$parse(f),c.$apply(),O.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):f(b)}),c.$$phase||
c.$digest())});var l=0;c.$watch(function(){var a=d.url(),b=h.$$replace;l&&a==h.absUrl()||(l++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),f(a))}));h.$$replace=!1;return l});return h}]}function ee(){var b=!0,a=this;this.debugEnabled=function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:
a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||C;a=!1;try{a=!!e.apply}catch(m){}return a?function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function fa(b,a){if("constructor"===b)throw Ca("isecfld",a);return b}function $a(b,
a){if(b){if(b.constructor===b)throw Ca("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw Ca("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw Ca("isecdom",a);}return b}function sb(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=fa(a.shift(),d);var h=b[g];h||(h={},b[g]=h);b=h;b.then&&e.unwrapPromises&&(va(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===s&&(b.$$v={}),b=b.$$v)}g=fa(a.shift(),d);return b[g]=c}function Gc(b,
a,c,d,e,g,f){fa(b,g);fa(a,g);fa(c,g);fa(d,g);fa(e,g);return f.unwrapPromises?function(f,m){var k=m&&m.hasOwnProperty(b)?m:f,l;if(null==k)return k;(k=k[b])&&k.then&&(va(g),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!a)return k;if(null==k)return s;(k=k[a])&&k.then&&(va(g),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!c)return k;if(null==k)return s;(k=k[c])&&k.then&&(va(g),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!d)return k;if(null==
k)return s;(k=k[d])&&k.then&&(va(g),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!e)return k;if(null==k)return s;(k=k[e])&&k.then&&(va(g),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);return k}:function(g,f){var k=f&&f.hasOwnProperty(b)?f:g;if(null==k)return k;k=k[b];if(!a)return k;if(null==k)return s;k=k[a];if(!c)return k;if(null==k)return s;k=k[c];if(!d)return k;if(null==k)return s;k=k[d];return e?null==k?s:k=k[e]:k}}function He(b,a){fa(b,a);return function(a,
d){return null==a?s:(d&&d.hasOwnProperty(b)?d:a)[b]}}function Ie(b,a,c){fa(b,c);fa(a,c);return function(c,e){if(null==c)return s;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?s:c[a]}}function Hc(b,a,c){if(Pb.hasOwnProperty(b))return Pb[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)g=6>e?Gc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,h;do h=Gc(d[f++],d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=s,b=h;while(f<e);return h};else{var f="var p;\n";
q(d,function(b,d){fa(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var f=f+"return s;",h=new Function("s","k","pw",f);h.toString=aa(f);g=a.unwrapPromises?function(a,b){return h(a,b,va)}:h}else g=Ie(d[0],d[1],c);else g=He(d[0],c);"hasOwnProperty"!==
b&&(Pb[b]=g);return g}function fe(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return B(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return B(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;va=function(b){a.logPromiseWarnings&&!Ic.hasOwnProperty(b)&&(Ic[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};
return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Qb(a);e=(new ab(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return C}}}]}function he(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Je(function(a){b.$evalAsync(a)},a)}]}function Je(b,a){function c(a){return a}function d(a){return f(a)}var e=function(){var f=[],k,l;return l={resolve:function(a){if(f){var c=f;f=s;k=g(a);c.length&&b(function(){for(var a,
b=0,d=c.length;b<d;b++)a=c[b],k.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(h(a))},notify:function(a){if(f){var c=f;f.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,h){var l=e(),z=function(d){try{l.resolve((P(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},K=function(b){try{l.resolve((P(g)?g:d)(b))}catch(c){l.reject(c),a(c)}},w=function(b){try{l.notify((P(h)?h:c)(b))}catch(d){a(d)}};f?f.push([z,K,w]):k.then(z,K,w);return l.promise},"catch":function(a){return this.then(null,
a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,g){var f=null;try{f=(a||c)()}catch(h){return b(h,!1)}return f&&P(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&P(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(a){var b=e();b.reject(a);return b.promise},h=function(c){return{then:function(g,
f){var h=e();b(function(){try{h.resolve((P(f)?f:d)(c))}catch(b){h.reject(b),a(b)}});return h.promise}}};return{defer:e,reject:f,when:function(h,k,l,n){var p=e(),r,u=function(b){try{return(P(k)?k:c)(b)}catch(d){return a(d),f(d)}},z=function(b){try{return(P(l)?l:d)(b)}catch(c){return a(c),f(c)}},K=function(b){try{return(P(n)?n:c)(b)}catch(d){a(d)}};b(function(){g(h).then(function(a){r||(r=!0,p.resolve(g(a).then(u,z,K)))},function(a){r||(r=!0,p.resolve(z(a)))},function(a){r||p.notify(K(a))})});return p.promise},
all:function(a){var b=e(),c=0,d=M(a)?[]:{};q(a,function(a,e){c++;g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function oe(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,g=e?
function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};g.supported=e;return g}]}function ge(){var b=10,a=v("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,g,f){function h(){this.$id=eb();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;
this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(p.$$phase)throw a("inprog",p.$$phase);p.$$phase=b}function k(a,b){var c=g(a);Ra(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=
this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=eb());a["this"]=a;a.$$listeners={};a.$$listenerCount={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=k(a,"watch"),g=this.$$watchers,f={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!P(b)){var h=k(b||C,"listener");f.fn=function(a,
b,c){h(c)}}if("string"==typeof a&&e.constant){var m=f.fn;f.fn=function(a,b,c){m.call(this,a,b,c);Fa(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Fa(g,f);c=null}},$watchCollection:function(a,b){var c=this,d,e,f,h=1<b.length,k=0,m=g(a),l=[],n={},p=!0,q=0;return this.$watch(function(){d=m(c);var a,b;if(X(d))if(db(d))for(e!==l&&(e=l,q=e.length=0,k++),a=d.length,q!==a&&(k++,e.length=q=a),b=0;b<a;b++)e[b]!==e[b]&&d[b]!==d[b]||e[b]===d[b]||(k++,e[b]=d[b]);else{e!==n&&(e=n={},q=0,k++);a=
0;for(b in d)d.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?e[b]!==d[b]&&(k++,e[b]=d[b]):(q++,e[b]=d[b],k++));if(q>a)for(b in k++,e)e.hasOwnProperty(b)&&!d.hasOwnProperty(b)&&(q--,delete e[b])}else e!==d&&(e=d,k++);return k},function(){p?(p=!1,b(d,d,c)):b(d,f,c);if(h)if(X(d))if(db(d)){f=Array(d.length);for(var a=0;a<d.length;a++)f[a]=d[a]}else for(a in f={},d)Jc.call(d,a)&&(f[a]=d[a]);else f=d})},$digest:function(){var d,g,f,h,k=this.$$asyncQueue,l=this.$$postDigestQueue,q,x,s=b,L,Q=[],y,E,R;m("$digest");
c=null;do{x=!1;for(L=this;k.length;){try{R=k.shift(),R.scope.$eval(R.expression)}catch(B){p.$$phase=null,e(B)}c=null}a:do{if(h=L.$$watchers)for(q=h.length;q--;)try{if(d=h[q])if((g=d.get(L))!==(f=d.last)&&!(d.eq?za(g,f):"number"==typeof g&&"number"==typeof f&&isNaN(g)&&isNaN(f)))x=!0,c=d,d.last=d.eq?ba(g):g,d.fn(g,f===n?g:f,L),5>s&&(y=4-s,Q[y]||(Q[y]=[]),E=P(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,E+="; newVal: "+ta(g)+"; oldVal: "+ta(f),Q[y].push(E));else if(d===c){x=!1;break a}}catch(t){p.$$phase=
null,e(t)}if(!(h=L.$$childHead||L!==this&&L.$$nextSibling))for(;L!==this&&!(h=L.$$nextSibling);)L=L.$parent}while(L=h);if((x||k.length)&&!s--)throw p.$$phase=null,a("infdig",b,ta(Q));}while(x||k.length);for(p.$$phase=null;l.length;)try{l.shift()()}catch(S){e(S)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==p&&(q(this.$$listenerCount,hb(null,l,this)),a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&
(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=C,this.$on=this.$watch=function(){return C})}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){p.$$phase||
p.$$asyncQueue.length||f.defer(function(){p.$$asyncQueue.length&&p.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{p.$$phase=null;try{p.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);
var e=this;return function(){c[gb(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,g=this,f=!1,h={name:a,targetScope:g,stopPropagation:function(){f=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},k=[h].concat(sa.call(arguments,1)),m,l;do{d=g.$$listeners[a]||c;h.currentScope=g;m=0;for(l=d.length;m<l;m++)if(d[m])try{d[m].apply(null,k)}catch(n){e(n)}else d.splice(m,1),m--,l--;if(f)break;g=g.$parent}while(g);return h},$broadcast:function(a,b){for(var c=this,d=this,g={name:a,
targetScope:this,preventDefault:function(){g.defaultPrevented=!0},defaultPrevented:!1},f=[g].concat(sa.call(arguments,1)),h,k;c=d;){g.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,f)}catch(m){e(m)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return g}};var p=new h;return p}]}function kd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file|blob):|data:image\//;
this.aHrefSanitizationWhitelist=function(a){return B(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!T||8<=T)if(g=ua(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Ke(b){if("self"===b)return b;if(t(b)){if(-1<b.indexOf("***"))throw wa("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+
b+"$")}if(fb(b))return RegExp("^"+b.source+"$");throw wa("imatcher");}function Kc(b){var a=[];B(b)&&q(b,function(b){a.push(Ke(b))});return a}function je(){this.SCE_CONTEXTS=ga;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Kc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Kc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=
function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw wa("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var g=d(),f={};f[ga.HTML]=d(g);f[ga.CSS]=d(g);f[ga.URL]=d(g);f[ga.JS]=d(g);f[ga.RESOURCE_URL]=d(f[ga.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw wa("icontext",a,b);if(null===b||b===s||""===b)return b;if("string"!==typeof b)throw wa("itype",a);return new c(b)},
getTrusted:function(c,d){if(null===d||d===s||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===ga.RESOURCE_URL){var g=ua(d.toString()),l,n,p=!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Lb(g):b[l].exec(g.href)){p=!0;break}if(p)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Lb(g):a[l].exec(g.href)){p=!1;break}if(p)return d;throw wa("insecurl",d.toString());}if(c===ga.HTML)return e(d);throw wa("unsafe");},valueOf:function(a){return a instanceof
g?a.$$unwrapTrustedValue():a}}}]}function ie(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw wa("iequirks");var e=ba(ga);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Ea);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,
d(a,c))}};var g=e.parseAs,f=e.getTrusted,h=e.trustAs;q(ga,function(a,b){var c=I(b);e[Ta("parse_as_"+c)]=function(b){return g(a,b)};e[Ta("get_trusted_"+c)]=function(b){return f(a,b)};e[Ta("trust_as_"+c)]=function(b){return h(a,b)}});return e}]}function ke(){this.$get=["$window","$document",function(b,a){var c={},d=Y((/android (\d+)/.exec(I((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),g=a[0]||{},f=g.documentMode,h,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=g.body&&g.body.style,
l=!1,n=!1;if(k){for(var p in k)if(l=m.exec(p)){h=l[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in k&&"webkit");l=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in k);!d||l&&n||(l=t(g.body.style.webkitTransition),n=t(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<f),hasEvent:function(a){if("input"==a&&9==T)return!1;if(D(c[a])){var b=g.createElement("div");c[a]="on"+
a in b}return c[a]},csp:Yb(),vendorPrefix:h,transitions:l,animations:n,android:d,msie:T,msieDocumentMode:f}}]}function me(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,m){var k=c.defer(),l=k.promise,n=B(m)&&!m;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete g[l.$$timeoutId]}n||b.$apply()},h);l.$$timeoutId=h;g[h]=k;return l}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),
delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function ua(b,a){var c=b;T&&(W.setAttribute("href",c),c=W.href);W.setAttribute("href",c);return{href:W.href,protocol:W.protocol?W.protocol.replace(/:$/,""):"",host:W.host,search:W.search?W.search.replace(/^\?/,""):"",hash:W.hash?W.hash.replace(/^#/,""):"",hostname:W.hostname,port:W.port,pathname:"/"===W.pathname.charAt(0)?W.pathname:"/"+W.pathname}}function Lb(b){b=t(b)?ua(b):b;return b.protocol===Lc.protocol&&b.host===Lc.host}
function ne(){this.$get=aa(O)}function jc(b){function a(d,e){if(X(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Mc);a("date",Nc);a("filter",Le);a("json",Me);a("limitTo",Ne);a("lowercase",Oe);a("number",Oc);a("orderBy",Pc);a("uppercase",Pe)}function Le(){return function(b,a,c){if(!M(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;
return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Qa.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Jc.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,
b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return g("$"==b?c:c&&c[b],a[b])})})(f);break;case "function":e.push(a);break;default:return b}d=[];for(f=0;f<b.length;f++){var h=b[f];e.check(h)&&d.push(h)}return d}}function Mc(b){var a=
b.NUMBER_FORMATS;return function(b,d){D(d)&&(d=a.CURRENCY_SYM);return Qc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Oc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Qc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Qc(b,a,c,d,e){if(null==b||!isFinite(b)||X(b))return"";var g=0>b;b=Math.abs(b);var f=b+"",h="",m=[],k=!1;if(-1!==f.indexOf("e")){var l=f.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&l[3]>e+1?f="0":(h=f,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));
else{f=(f.split(Rc)[1]||"").length;D(e)&&(e=Math.min(Math.max(a.minFrac,f),a.maxFrac));f=Math.pow(10,e);b=Math.round(b*f)/f;b=(""+b).split(Rc);f=b[0];b=b[1]||"";var l=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(l=f.length-n,k=0;k<l;k++)0===(l-k)%p&&0!==k&&(h+=c),h+=f.charAt(k);for(k=l;k<f.length;k++)0===(f.length-k)%n&&0!==k&&(h+=c),h+=f.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}m.push(g?a.negPre:a.posPre);m.push(h);m.push(g?a.negSuf:a.posSuf);return m.join("")}function tb(b,
a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function $(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return tb(e,a,d)}}function ub(b,a){return function(c,d){var e=c["get"+b](),g=Ga(a?"SHORT"+b:b);return d[g][e]}}function Sc(b){var a=(new Date(b,0,1)).getDay();return new Date(b,0,(4>=a?5:12)-a)}function Tc(b){return function(a){var c=Sc(a.getFullYear());a=+new Date(a.getFullYear(),a.getMonth(),a.getDate()+
(4-a.getDay()))-+c;a=1+Math.round(a/6048E5);return tb(a,b)}}function Nc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var g=0,f=0,h=b[8]?a.setUTCFullYear:a.setFullYear,m=b[8]?a.setUTCHours:a.setHours;b[9]&&(g=Y(b[9]+b[10]),f=Y(b[9]+b[11]));h.call(a,Y(b[1]),Y(b[2])-1,Y(b[3]));g=Y(b[4]||0)-g;f=Y(b[5]||0)-f;h=Y(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));m.call(a,g,f,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
return function(c,e){var g="",f=[],h,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;t(c)&&(c=Qe.test(c)?Y(c):a(c));Ab(c)&&(c=new Date(c));if(!ra(c))return c;for(;e;)(m=Re.exec(e))?(f=f.concat(sa.call(m,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){h=Se[a];g+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function Me(){return function(b){return ta(b,!0)}}function Ne(){return function(b,a){if(!M(b)&&!t(b))return b;a=Y(a);if(t(b))return a?0<=a?b.slice(0,a):b.slice(a,
b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Pc(b){return function(a,c,d){function e(a,b){return Pa(b)?function(b,c){return a(c,b)}:a}function g(a,b){var c=typeof a,d=typeof b;return c==d?("string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!M(a)||!c)return a;c=M(c)?c:[c];c=cd(c,function(a){var c=!1,d=a||Ea;if(t(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c=
"-"==a.charAt(0),a=a.substring(1);d=b(a);if(d.constant){var f=d();return e(function(a,b){return g(a[f],b[f])},c)}}return e(function(a,b){return g(d(a),d(b))},c)});for(var f=[],h=0;h<a.length;h++)f.push(a[h]);return f.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function xa(b){P(b)&&(b={link:b});b.restrict=b.restrict||"AC";return aa(b)}function Uc(b,a,c,d){function e(a,c){c=c?"-"+ib(c,"-"):"";d.removeClass(b,(a?vb:wb)+c);d.addClass(b,(a?wb:vb)+c)}
var g=this,f=b.parent().controller("form")||xb,h=0,m=g.$error={},k=[];g.$name=a.name||a.ngForm;g.$dirty=!1;g.$pristine=!0;g.$valid=!0;g.$invalid=!1;f.$addControl(g);b.addClass(Ma);e(!0);g.$addControl=function(a){Ba(a.$name,"input");k.push(a);a.$name&&(g[a.$name]=a)};g.$removeControl=function(a){a.$name&&g[a.$name]===a&&delete g[a.$name];q(m,function(b,c){g.$setValidity(c,!0,a)});Fa(k,a)};g.$setValidity=function(a,b,c){var d=m[a];if(b)d&&(Fa(d,c),d.length||(h--,h||(e(b),g.$valid=!0,g.$invalid=!1),
m[a]=!1,e(!0,a),f.$setValidity(a,!0,g)));else{h||e(b);if(d){if(-1!=gb(d,c))return}else m[a]=d=[],h++,e(!1,a),f.$setValidity(a,!1,g);d.push(c);g.$valid=!1;g.$invalid=!0}};g.$setDirty=function(){d.removeClass(b,Ma);d.addClass(b,yb);g.$dirty=!0;g.$pristine=!1;f.$setDirty()};g.$setPristine=function(){d.removeClass(b,yb);d.addClass(b,Ma);g.$dirty=!1;g.$pristine=!0;q(k,function(a){a.$setPristine()})}}function qa(b,a,c,d){b.$setValidity(a,c);return c?d:s}function Te(b,a,c){var d=c.prop("validity");X(d)&&
b.$parsers.push(function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)})}function bb(b,a,c,d,e,g){var f=a.prop("validity");if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});a.on("compositionend",function(){h=!1;m()})}var m=function(){if(!h){var e=a.val();Pa(c.ngTrim||"T")&&(e=ca(e));if(d.$viewValue!==e||f&&""===e&&!f.valueMissing)b.$$phase?d.$setViewValue(e):b.$apply(function(){d.$setViewValue(e)})}};if(e.hasEvent("input"))a.on("input",
m);else{var k,l=function(){k||(k=g.defer(function(){m();k=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||l()});if(e.hasEvent("paste"))a.on("paste cut",l)}a.on("change",m);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var n=c.ngPattern;n&&((e=n.match(/^\/(.*)\/([gim]*)$/))?(n=RegExp(e[1],e[2]),e=function(a){return qa(d,"pattern",d.$isEmpty(a)||n.test(a),a)}):e=function(c){var e=b.$eval(n);if(!e||!e.test)throw v("ngPattern")("noregexp",n,
e,ha(a));return qa(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var p=Y(c.ngMinlength);e=function(a){return qa(d,"minlength",d.$isEmpty(a)||a.length>=p,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var r=Y(c.ngMaxlength);e=function(a){return qa(d,"maxlength",d.$isEmpty(a)||a.length<=r,a)};d.$parsers.push(e);d.$formatters.push(e)}}function zb(b,a){return function(c){var d;return ra(c)?c:t(c)&&(b.lastIndex=0,c=b.exec(c))?(c.shift(),
d={yyyy:0,MM:1,dd:1,HH:0,mm:0},q(c,function(b,c){c<a.length&&(d[a[c]]=+b)}),new Date(d.yyyy,d.MM-1,d.dd,d.HH,d.mm)):NaN}}function cb(b,a,c,d){return function(e,g,f,h,m,k,l){bb(e,g,f,h,m,k);h.$parsers.push(function(d){if(h.$isEmpty(d))return h.$setValidity(b,!0),null;if(a.test(d))return h.$setValidity(b,!0),c(d);h.$setValidity(b,!1);return s});h.$formatters.push(function(a){return ra(a)?l("date")(a,d):""});f.min&&(e=function(a){var b=h.$isEmpty(a)||c(a)>=c(f.min);h.$setValidity("min",b);return b?a:
s},h.$parsers.push(e),h.$formatters.push(e));f.max&&(e=function(a){var b=h.$isEmpty(a)||c(a)<=c(f.max);h.$setValidity("max",b);return b?a:s},h.$parsers.push(e),h.$formatters.push(e))}}function Rb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],l=0;l<b.length;l++)if(e==b[l])continue a;c.push(e)}return c}function e(a){if(!M(a)){if(t(a))return a.split(" ");if(X(a)){var b=[];q(a,function(a,c){a&&b.push(c)});return b}}return a}return{restrict:"AC",
link:function(g,f,h){function m(a,b){var c=f.data("$classCounts")||{},d=[];q(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});f.data("$classCounts",c);return d.join(" ")}function k(b){if(!0===a||g.$index%2===a){var k=e(b||[]);if(!l){var r=m(k,1);h.$addClass(r)}else if(!za(b,l)){var q=e(l),r=d(k,q),k=d(q,k),k=m(k,-1),r=m(r,1);0===r.length?c.removeClass(f,k):0===k.length?c.addClass(f,r):c.setClass(f,r,k)}}l=ba(b)}var l;g.$watch(h[b],k,!0);h.$observe("class",function(a){k(g.$eval(h[b]))});
"ngClass"!==b&&g.$watch("$index",function(c,d){var f=c&1;if(f!==d&1){var k=e(g.$eval(h[b]));f===a?(f=m(k,1),h.$addClass(f)):(f=m(k,-1),h.$removeClass(f))}})}}}]}var I=function(b){return t(b)?b.toLowerCase():b},Jc=Object.prototype.hasOwnProperty,Ga=function(b){return t(b)?b.toUpperCase():b},T,y,Ha,sa=[].slice,Ue=[].push,ya=Object.prototype.toString,Oa=v("ng"),Qa=O.angular||(O.angular={}),Sa,La,ka=["0","0","0"];T=Y((/msie (\d+)/.exec(I(navigator.userAgent))||[])[1]);isNaN(T)&&(T=Y((/trident\/.*; rv:(\d+)/.exec(I(navigator.userAgent))||
[])[1]));C.$inject=[];Ea.$inject=[];var ca=function(){return String.prototype.trim?function(b){return t(b)?b.trim():b}:function(b){return t(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();La=9>T?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ga(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var fd=/[A-Z]/g,id={full:"1.3.0-beta.5",major:1,minor:3,dot:0,codeName:"chimeric-glitterfication"},Va=N.cache={},jb=N.expando="ng-"+
(new Date).getTime(),we=1,qb=O.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Ua=O.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};N._data=function(b){return this.cache[b[this.expando]]||{}};var qe=/([\:\-\_]+(.))/g,re=/^moz([A-Z])/,Hb=v("jqLite"),ve=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Gb=/<|&#?\w+;/,te=/<([\w:]+)/,ue=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
ea={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ea.optgroup=ea.option;ea.tbody=ea.tfoot=ea.colgroup=ea.caption=ea.thead;ea.th=ea.td;var Ka=N.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===U.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),N(O).on("load",a))},
toString:function(){var b=[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?y(this[b]):y(this[this.length+b])},length:0,push:Ue,sort:[].sort,splice:[].splice},nb={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){nb[I(b)]=b});var rc={};q("input select option textarea button form details".split(" "),function(b){rc[Ga(b)]=!0});q({data:nc,inheritedData:mb,scope:function(b){return y(b).data("$scope")||mb(b.parentNode||b,["$isolateScope",
"$scope"])},isolateScope:function(b){return y(b).data("$isolateScope")||y(b).data("$isolateScopeNoTemplate")},controller:oc,injector:function(b){return mb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Jb,css:function(b,a,c){a=Ta(a);if(B(c))b.style[a]=c;else{var d;8>=T&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=T&&(d=""===d?s:d);return d}},attr:function(b,a,c){var d=I(a);if(nb[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));
else return b[a]||(b.attributes.getNamedItem(a)||C).specified?d:s;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?s:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(D(d))return e?b[e]:"";b[e]=d}var a=[];9>T?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(D(a)){if("SELECT"===La(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&
c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(D(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ia(d[c]);b.innerHTML=a},empty:pc},function(b,a){N.prototype[a]=function(a,d){var e,g;if(b!==pc&&(2==b.length&&b!==Jb&&b!==oc?a:d)===s){if(X(a)){for(e=0;e<this.length;e++)if(b===nc)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;g=e===s?Math.min(this.length,1):this.length;for(var f=0;f<g;f++){var h=b(this[f],a,d);e=
e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});q({removeData:lc,dealoc:Ia,on:function a(c,d,e,g){if(B(g))throw Hb("onargs");var f=la(c,"events"),h=la(c,"handle");f||la(c,"events",f={});h||la(c,"handle",h=xe(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==d||"mouseleave"==d){var l=U.body.contains||U.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):
a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||h(a,d)})}else qb(c,d,h),f[d]=[];g=f[d]}g.push(e)})},off:mc,one:function(a,c,d){a=y(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ia(a);q(new N(c),function(c){d?e.insertBefore(c,d.nextSibling):
e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){q(new N(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new N(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=y(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ia(a);
var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new N(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:lb,removeClass:kb,toggleClass:function(a,c,d){c&&q(c.split(" "),function(c){var g=d;D(g)&&(g=!Jb(a,c));(g?lb:kb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?
a.getElementsByTagName(c):[]},clone:Ib,triggerHandler:function(a,c,d){c=(la(a,"events")||{})[c];d=d||[];var e=[{preventDefault:C,stopPropagation:C}];q(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){N.prototype[c]=function(c,e,g){for(var f,h=0;h<this.length;h++)D(f)?(f=a(this[h],c,e,g),B(f)&&(f=y(f))):kc(f,a(this[h],c,e,g));return B(f)?f:this};N.prototype.bind=N.prototype.on;N.prototype.unbind=N.prototype.off});Wa.prototype={put:function(a,c){this[Ja(a)]=c},get:function(a){return this[Ja(a)]},
remove:function(a){var c=this[a=Ja(a)];delete this[a];return c}};var ze=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,Ae=/,/,Be=/^\s*(_?)(\S+?)\1\s*$/,ye=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Xa=v("$injector"),Ve=v("$animate"),Ud=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Ve("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?
a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,f,h){f?f.after(a):c.prepend(a);h&&d(h)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,h){this.enter(a,c,d,h)},addClass:function(a,c,f){c=t(c)?c:M(c)?c.join(" "):"";q(a,function(a){lb(a,c)});f&&d(f)},removeClass:function(a,c,f){c=t(c)?c:M(c)?c.join(" "):"";q(a,function(a){kb(a,c)});f&&d(f)},setClass:function(a,c,f,h){q(a,function(a){lb(a,c);kb(a,f)});h&&d(h)},enabled:C}}]}],
ja=v("$compile");fc.$inject=["$provide","$$sanitizeUriProvider"];var De=/^(x[\:\-_]|data[\:\-_])/i,zc=v("$interpolate"),We=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,Ge={http:80,https:443,ftp:21},Nb=v("$location");Ec.prototype=Ob.prototype=Dc.prototype={$$html5:!1,$$replace:!1,absUrl:rb("$$absUrl"),url:function(a,c){if(D(a))return this.$$url;var d=We.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:rb("$$protocol"),host:rb("$$host"),
port:rb("$$port"),path:Fc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(t(a))this.$$search=ac(a);else if(X(a))this.$$search=a;else throw Nb("isrcharg");break;default:D(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Fc("$$hash",Ea),replace:function(){this.$$replace=!0;return this}};var Ca=v("$parse"),Ic={},va,Na={"null":function(){return null},"true":function(){return!0},
"false":function(){return!1},undefined:C,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":C,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,
c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Xe={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},
Qb=function(a){this.options=a};Qb.prototype={constructor:Qb,lex:function(a){this.text=a;this.index=0;this.ch=s;this.lastCh=":";this.tokens=[];var c;for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));
else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{var d=this.ch+this.peek(),e=d+this.peek(2),g=Na[this.ch],f=Na[d],h=Na[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):f?(this.tokens.push({index:this.index,text:d,fn:f}),this.index+=2):g?(this.tokens.push({index:this.index,
text:this.ch,fn:g,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===
a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=B(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw Ca("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=I(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=
d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,json:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;
this.index++}if(e)for(g=this.index;g<this.text.length;){h=this.text.charAt(g);if("("===h){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(h))g++;else break}d={index:d,text:c};if(Na.hasOwnProperty(c))d.fn=Na[c],d.json=Na[c];else{var m=Hc(c,this.options,this.text);d.fn=A(function(a,c){return m(a,c)},{assign:function(d,e){return sb(d,c,e,a.text,a.options)}})}this.tokens.push(d);f&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+1,text:f,json:!1}))},
readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Xe[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}d+=
f}this.index++}this.throwError("Unterminated quote",c)}};var ab=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};ab.ZERO=A(function(){return 0},{constant:!0});ab.prototype={constructor:ab,parse:function(a,c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,this.functionCall=this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&
this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?
(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw Ca("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw Ca("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,
e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return A(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return A(function(e,g){return a(e,g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return A(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},
statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=
function(a,e,h){h=[h];for(var m=0;m<d.length;m++)h.push(d[m](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();
if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},
relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(ab.ZERO,a.fn,
this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Hc(d,this.options,this.text);return A(function(c,d,h){return e(h||a(c,d))},{assign:function(e,f,h){return sb(a(e,h),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return A(function(e,g){var f=a(e,g),h=d(e,g),m;if(!f)return s;(f=$a(f[h],c.text))&&(f.then&&c.options.unwrapPromises)&&(m=f,"$$v"in f||(m.$$v=s,m.then(function(a){m.$$v=
a})),f=f.$$v);return f},{assign:function(e,g,f){var h=d(e,f);return $a(a(e,f),c.text)[h]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var h=[],m=c?c(g,f):g,k=0;k<d.length;k++)h.push(d[k](g,f));k=a(g,f,m)||C;$a(m,e.text);$a(k,e.text);h=k.apply?k.apply(m,h):k(h[0],h[1],h[2],h[3],h[4]);return $a(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;
var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return A(function(c,d){for(var f=[],h=0;h<a.length;h++)f.push(a[h](c,d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return A(function(c,d){for(var e={},m=0;m<
a.length;m++){var k=a[m];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Pb={},wa=v("$sce"),ga={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},W=U.createElement("a"),Lc=ua(O.location.href,!0);jc.$inject=["$provide"];Mc.$inject=["$locale"];Oc.$inject=["$locale"];var Rc=".",Se={yyyy:$("FullYear",4),yy:$("FullYear",2,0,!0),y:$("FullYear",1),MMMM:ub("Month"),MMM:ub("Month",!0),MM:$("Month",2,1),M:$("Month",1,1),dd:$("Date",2),d:$("Date",1),HH:$("Hours",2),H:$("Hours",
1),hh:$("Hours",2,-12),h:$("Hours",1,-12),mm:$("Minutes",2),m:$("Minutes",1),ss:$("Seconds",2),s:$("Seconds",1),sss:$("Milliseconds",3),EEEE:ub("Day"),EEE:ub("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(tb(Math[0<a?"floor":"ceil"](a/60),2)+tb(Math.abs(a%60),2))},ww:Tc(2),w:Tc(1)},Re=/((?:[^yMdHhmsaZEw']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|w+))(.*)/,Qe=/^\-?\d+$/;Nc.$inject=["$locale"];var Oe=
aa(I),Pe=aa(Ga);Pc.$inject=["$parse"];var ld=aa({restrict:"E",compile:function(a,c){8>=T&&(c.href||c.name||c.$set("href",""),a.append(U.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var g="[object SVGAnimatedString]"===ya.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(g)||a.preventDefault()})}}}),Eb={};q(nb,function(a,c){if("multiple"!=a){var d=na("ng-"+c);Eb[d]=function(){return{priority:100,link:function(a,g,f){a.$watch(f[d],function(a){f.$set(c,
!!a)})}}}}});q(["src","srcset","href"],function(a){var c=na("ng-"+a);Eb[c]=function(){return{priority:99,link:function(d,e,g){var f=a,h=a;"href"===a&&"[object SVGAnimatedString]"===ya.call(e.prop("href"))&&(h="xlinkHref",g.$attr[h]="xlink:href",f=null);g.$observe(c,function(a){a&&(g.$set(h,a),T&&f&&e.prop(f,g[h]))})}}}});var xb={$addControl:C,$removeControl:C,$setValidity:C,$setDirty:C,$setPristine:C};Uc.$inject=["$element","$attrs","$scope","$animate"];var Vc=function(a){return["$timeout",function(c){return{name:"form",
restrict:a?"EAC":"E",controller:Uc,compile:function(){return{pre:function(a,e,g,f){if(!g.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};qb(e[0],"submit",h);e.on("$destroy",function(){c(function(){Ua(e[0],"submit",h)},0,!1)})}var m=e.parent().controller("form"),k=g.name||g.ngForm;k&&sb(a,k,f,k);if(m)e.on("$destroy",function(){m.$removeControl(f);k&&sb(a,k,s,k);A(f,xb)})}}}}}]},md=Vc(),zd=Vc(!0),Ye=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
Ze=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,$e=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Wc=/^(\d{4})-(\d{2})-(\d{2})$/,Xc=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/,Sb=/^(\d{4})-W(\d\d)$/,Yc=/^(\d{4})-(\d\d)$/,Zc=/^(\d\d):(\d\d)$/,$c={text:bb,date:cb("date",Wc,zb(Wc,["yyyy","MM","dd"]),"yyyy-MM-dd"),"datetime-local":cb("datetimelocal",Xc,zb(Xc,["yyyy","MM","dd","HH","mm"]),"yyyy-MM-ddTHH:mm"),time:cb("time",Zc,zb(Zc,["HH","mm"]),"HH:mm"),week:cb("week",Sb,function(a){if(ra(a))return a;
if(t(a)){Sb.lastIndex=0;var c=Sb.exec(a);if(c){a=+c[1];var d=+c[2],c=Sc(a),d=7*(d-1);return new Date(a,0,c.getDate()+d)}}return NaN},"yyyy-Www"),month:cb("month",Yc,zb(Yc,["yyyy","MM"]),"yyyy-MM"),number:function(a,c,d,e,g,f){bb(a,c,d,e,g,f);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||$e.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return s});Te(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=
parseFloat(d.min);return qa(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return qa(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return qa(e,"number",e.$isEmpty(a)||Ab(a),a)})},url:function(a,c,d,e,g,f){bb(a,c,d,e,g,f);a=function(a){return qa(e,"url",e.$isEmpty(a)||Ye.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,f){bb(a,c,d,e,g,f);
a=function(a){return qa(e,"email",e.$isEmpty(a)||Ze.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){D(d.name)&&c.attr("name",eb());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;t(g)||(g=!0);t(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});
e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==g};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:C,button:C,submit:C,reset:C,file:C},gc=["$browser","$sniffer","$filter",function(a,c,d){return{restrict:"E",require:"?ngModel",link:function(e,g,f,h){h&&($c[I(f.type)]||$c.text)(e,g,f,h,c,a,d)}}}],wb="ng-valid",vb="ng-invalid",Ma="ng-pristine",yb="ng-dirty",af=["$scope","$exceptionHandler","$attrs","$element","$parse",
"$animate",function(a,c,d,e,g,f){function h(a,c){c=c?"-"+ib(c,"-"):"";f.removeClass(e,(a?vb:wb)+c);f.addClass(e,(a?wb:vb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var m=g(d.ngModel),k=m.assign;if(!k)throw v("ngModel")("nonassign",d.ngModel,ha(e));this.$render=C;this.$isEmpty=function(a){return D(a)||""===a||null===a||a!==a};var l=e.inheritedData("$formController")||
xb,n=0,p=this.$error={};e.addClass(Ma);h(!0);this.$setValidity=function(a,c){p[a]!==!c&&(c?(p[a]&&n--,n||(h(!0),this.$valid=!0,this.$invalid=!1)):(h(!1),this.$invalid=!0,this.$valid=!1,n++),p[a]=!c,h(c,a),l.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;f.removeClass(e,yb);f.addClass(e,Ma)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,f.removeClass(e,Ma),f.addClass(e,yb),l.$setDirty());q(this.$parsers,function(a){d=
a(d)});this.$modelValue!==d&&(this.$modelValue=d,k(a,d),q(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var r=this;a.$watch(function(){var c=m(a);if(r.$modelValue!==c){var d=r.$formatters,e=d.length;for(r.$modelValue=c;e--;)c=d[e](c);r.$viewValue!==c&&(r.$viewValue=c,r.$render())}return c})}],Od=function(){return{require:["ngModel","^?form"],controller:af,link:function(a,c,d,e){var g=e[0],f=e[1]||xb;f.$addControl(g);a.$on("$destroy",function(){f.$removeControl(g)})}}},Qd=aa({require:"ngModel",
link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),hc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},Pd=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||
d.ngList||",";e.$parsers.push(function(a){if(!D(a)){var c=[];a&&q(a.split(g),function(a){a&&c.push(ca(a))});return c}});e.$formatters.push(function(a){return M(a)?a.join(", "):s});e.$isEmpty=function(a){return!a||!a.length}}}},bf=/^(true|false|\d+)$/,Rd=function(){return{priority:100,compile:function(a,c){return bf.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",a)})}}}},rd=xa(function(a,c,d){c.addClass("ng-binding").data("$binding",
d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==s?"":a)})}),td=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],sd=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);d.$watch(function(){return(f(d)||"").toString()},function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],ud=Rb("",!0),wd=
Rb("Odd",0),vd=Rb("Even",1),xd=xa({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),yd=[function(){return{scope:!0,controller:"@",priority:500}}],ic={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=na("ng-"+a);ic[c]=["$parse",function(d){return{compile:function(e,g){var f=d(g[c]);return function(c,d,e){d.on(I(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});
var Bd=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,g,f){var h,m,k;c.$watch(e.ngIf,function(g){Pa(g)?m||(m=c.$new(),f(m,function(c){c[c.length++]=U.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(k&&(k.remove(),k=null),m&&(m.$destroy(),m=null),h&&(k=Db(h.clone),a.leave(k,function(){k=null}),h=null))})}}}],Cd=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,g){return{restrict:"ECA",
priority:400,terminal:!0,transclude:"element",controller:Qa.noop,compile:function(f,h){var m=h.ngInclude||h.src,k=h.onload||"",l=h.autoscroll;return function(f,h,r,q,z){var s=0,w,y,G,x=function(){y&&(y.remove(),y=null);w&&(w.$destroy(),w=null);G&&(e.leave(G,function(){y=null}),y=G,G=null)};f.$watch(g.parseAsResourceUrl(m),function(g){var m=function(){!B(l)||l&&!f.$eval(l)||d()},r=++s;g?(a.get(g,{cache:c}).success(function(a){if(r===s){var c=f.$new();q.template=a;a=z(c,function(a){x();e.enter(a,null,
h,m)});w=c;G=a;w.$emit("$includeContentLoaded");f.$eval(k)}}).error(function(){r===s&&x()}),f.$emit("$includeContentRequested")):(x(),q.template=null)})}}}}],Sd=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],Dd=xa({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),Ed=xa({terminal:!0,priority:1E3}),Fd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",
link:function(e,g,f){var h=f.count,m=f.$attr.when&&g.attr(f.$attr.when),k=f.offset||0,l=e.$eval(m)||{},n={},p=c.startSymbol(),r=c.endSymbol(),s=/^when(Minus)?(.+)$/;q(f,function(a,c){s.test(c)&&(l[I(c.replace("when","").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(l,function(a,e){n[e]=c(a.replace(d,p+h+"-"+k+r))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in l||(c=a.pluralCat(c-k));return n[c](e,g,!0)},function(a){g.text(a)})}}}],Gd=["$parse","$animate",function(a,
c){var d=v("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,g,f,h,m){var k=f.ngRepeat,l=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,p,r,s,z,B,w={$id:Ja};if(!l)throw d("iexp",k);f=l[1];h=l[2];(l=l[3])?(n=a(l),p=function(a,c,d){B&&(w[B]=a);w[z]=c;w.$index=d;return n(e,w)}):(r=function(a,c){return Ja(c)},s=function(a){return a});l=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",f);z=l[3]||l[1];
B=l[2];var H={};e.$watchCollection(h,function(a){var f,h,l=g[0],n,w={},E,R,t,C,S,v,D=[];if(db(a))S=a,n=p||r;else{n=p||s;S=[];for(t in a)a.hasOwnProperty(t)&&"$"!=t.charAt(0)&&S.push(t);S.sort()}E=S.length;h=D.length=S.length;for(f=0;f<h;f++)if(t=a===S?f:S[f],C=a[t],C=n(t,C,f),Ba(C,"`track by` id"),H.hasOwnProperty(C))v=H[C],delete H[C],w[C]=v,D[f]=v;else{if(w.hasOwnProperty(C))throw q(D,function(a){a&&a.scope&&(H[a.id]=a)}),d("dupes",k,C);D[f]={id:C};w[C]=!1}for(t in H)H.hasOwnProperty(t)&&(v=H[t],
f=Db(v.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=!0}),v.scope.$destroy());f=0;for(h=S.length;f<h;f++){t=a===S?f:S[f];C=a[t];v=D[f];D[f-1]&&(l=D[f-1].clone[D[f-1].clone.length-1]);if(v.scope){R=v.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);v.clone[0]!=n&&c.move(Db(v.clone),null,y(l));l=v.clone[v.clone.length-1]}else R=e.$new();R[z]=C;B&&(R[B]=t);R.$index=f;R.$first=0===f;R.$last=f===E-1;R.$middle=!(R.$first||R.$last);R.$odd=!(R.$even=0===(f&1));v.scope||m(R,function(a){a[a.length++]=
U.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,y(l));l=a;v.scope=R;v.clone=a;w[v.id]=v})}H=w})}}}],Hd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Pa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],Ad=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Pa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],Id=xa(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Jd=["$animate",
function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,g){var f,h,m,k=[];c.$watch(e.ngSwitch||e.on,function(d){var n,p=k.length;if(0<p){if(m){for(n=0;n<p;n++)m[n].remove();m=null}m=[];for(n=0;n<p;n++){var r=h[n];k[n].$destroy();m[n]=r;a.leave(r,function(){m.splice(n,1);0===m.length&&(m=null)})}}h=[];k=[];if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();k.push(e);d.transclude(e,function(c){var e=d.element;
h.push(c);a.enter(c,e.parent(),e)})})})}}}],Kd=xa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:g,element:c})}}),Ld=xa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:g,element:c})}}),Nd=xa({link:function(a,c,d,e,g){if(!g)throw v("ngTransclude")("orphan",ha(c));g(function(a){c.empty();
c.append(a)})}}),nd=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],cf=v("ngOptions"),Md=aa({terminal:!0}),od=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,e={$setViewValue:C};return{restrict:"E",require:["select","?ngModel"],
controller:["$element","$scope","$attrs",function(a,c,d){var m=this,k={},l=e,n;m.databound=d.ngModel;m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){Ba(c,'"option value"');k[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete k[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Ja(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};m.hasOption=function(a){return k.hasOwnProperty(a)};
c.$on("$destroy",function(){m.renderUnknownOption=C})}],link:function(e,f,h,m){function k(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(G.parent()&&G.remove(),c.val(a),""===a&&v.prop("selected",!0)):D(a)&&v?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){G.parent()&&G.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Wa(d.$viewValue);q(c.find("option"),function(c){c.selected=B(a.get(c.value))})};a.$watch(function(){za(e,
d.$viewValue)||(e=ba(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,s,t,u;t=g.$modelValue;u=y(e)||[];var D=n?Tb(u):u,G,J,A;J={};s=!1;var E,I;if(r)if(v&&M(t))for(s=new Wa([]),A=0;A<t.length;A++)J[l]=t[A],s.put(v(e,J),t[A]);else s=new Wa(t);for(A=0;G=D.length,A<G;A++){k=A;if(n){k=D[A];if("$"===k.charAt(0))continue;J[n]=k}J[l]=
u[k];d=p(e,J)||"";(k=a[d])||(k=a[d]=[],c.push(d));r?d=B(s.remove(v?v(e,J):q(e,J))):(v?(d={},d[l]=t,d=v(e,d)===v(e,J)):d=t===q(e,J),s=s||d);E=m(e,J);E=B(E)?E:"";k.push({id:v?v(e,J):n?D[A]:A,label:E,selected:d})}r||(z||null===t?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));J=0;for(D=c.length;J<D;J++){d=c[J];k=a[d];x.length<=J?(t={element:C.clone().attr("label",d),label:k.label},u=[t],x.push(u),f.append(t.element)):(u=x[J],t=u[0],t.label!=d&&t.element.attr("label",
t.label=d));E=null;A=0;for(G=k.length;A<G;A++)s=k[A],(d=u[A+1])?(E=d.element,d.label!==s.label&&E.text(d.label=s.label),d.id!==s.id&&E.val(d.id=s.id),d.selected!==s.selected&&E.prop("selected",d.selected=s.selected)):(""===s.id&&z?I=z:(I=w.clone()).val(s.id).attr("selected",s.selected).text(s.label),u.push({element:I,label:s.label,id:s.id,selected:s.selected}),E?E.after(I):t.element.append(I),E=I);for(A++;u.length>A;)u.pop().element.remove()}for(;x.length>J;)x.pop()[0].element.remove()}var k;if(!(k=
t.match(d)))throw cf("iexp",t,ha(f));var m=c(k[2]||k[1]),l=k[4]||k[6],n=k[5],p=c(k[3]||""),q=c(k[2]?k[1]:l),y=c(k[7]),v=k[8]?c(k[8]):null,x=[[{element:f,label:""}]];z&&(a(z)(e),z.removeClass("ng-scope"),z.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=y(e)||[],d={},h,k,m,p,t,w,u;if(r)for(k=[],p=0,w=x.length;p<w;p++)for(a=x[p],m=1,t=a.length;m<t;m++){if((h=a[m].element)[0].selected){h=h.val();n&&(d[n]=h);if(v)for(u=0;u<c.length&&(d[l]=c[u],v(e,d)!=h);u++);else d[l]=c[h];k.push(q(e,
d))}}else{h=f.val();if("?"==h)k=s;else if(""===h)k=null;else if(v)for(u=0;u<c.length;u++){if(d[l]=c[u],v(e,d)==h){k=q(e,d);break}}else d[l]=c[h],n&&(d[n]=h),k=q(e,d);1<x[0].length&&x[0][1].id!==h&&(x[0][1].selected=!1)}g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(m[1]){var p=m[0];m=m[1];var r=h.multiple,t=h.ngOptions,z=!1,v,w=y(U.createElement("option")),C=y(U.createElement("optgroup")),G=w.clone();h=0;for(var x=f.children(),A=x.length;h<A;h++)if(""===x[h].value){v=z=x.eq(h);break}p.init(m,z,
G);r&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,f,m):r?l(e,f,m):k(e,f,m,p)}}}}],qd=["$interpolate",function(a){var c={addOption:C,removeOption:C};return{restrict:"E",priority:100,compile:function(d,e){if(D(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),l=k.data("$selectController")||k.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;g?a.$watch(g,function(a,c){e.$set("value",a);a!==c&&l.removeOption(c);l.addOption(a)}):
l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],pd=aa({restrict:"E",terminal:!1});O.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):((Ha=O.jQuery)?(y=Ha,A(Ha.fn,{scope:Ka.scope,isolateScope:Ka.isolateScope,controller:Ka.controller,injector:Ka.injector,inheritedData:Ka.inheritedData}),Fb("remove",!0,!0,!1),Fb("empty",!1,!1,!1),Fb("html",!1,!1,!0)):y=N,Qa.element=y,hd(Qa),y(U).ready(function(){ed(U,cc)}))})(window,document);
!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');


},{}],51:[function(require,module,exports){
!function(){"use strict";var t=angular.module("sticky",[]);t.directive("sticky",function(){function t(t,e,o){function s(){if(y.offsetWidth=h.offsetWidth,f(),n(),x){var t=window.getComputedStyle(h.parentElement,null),o=h.parentElement.offsetWidth-t.getPropertyValue("padding-right").replace("px","")-t.getPropertyValue("padding-left").replace("px","");e.css("width",o+"px")}}function i(){g.off("scroll",n),g.off("resize",s),m&&w.removeClass(m),I&&I.remove()}function n(){var t,e,s,i;if(d&&!P("("+d+")").matches&&!P(d).matches)return void(x&&f());if("top"===W?(i=window.pageYOffset||v.scrollTop,t=i-(v.clientTop||0),e=L===!0?t>=T&&k>=t:t>=T):(s=window.pageYOffset+window.innerHeight,e=T>=s),!e||l(o.stickLimit)||x){if(!e&&x){var n,c,p;c=[T,k],p=r(c,t),p==T?n="top":p==k&&(n="bottom"),f(n,t)}}else a()}function r(t,e){var o,s=0,i=1e3;for(s in t){var n=Math.abs(e-t[s]);i>n&&(i=n,o=t[s])}return o}function a(){var t,o;if(t=e[0].getBoundingClientRect(),o=t.left,y.offsetWidth=h.offsetWidth,x=!0,m&&w.addClass(m),u&&e.addClass(u),e.css("width",h.offsetWidth+"px").css("position","fixed").css(W,H+"px").css("left",o).css("margin-top",0),"bottom"===W&&e.css("margin-bottom",0),B){I=angular.element("<div>");var s=e[0].offsetHeight;I.css("height",s+"px"),e.after(I)}}function f(t){e.attr("style",b),x=!1,m&&w.removeClass(m),u&&e.removeClass(u),"top"==t?e.css("width","").css("top",y.top).css("position",y.position).css("left",y.cssLeft).css("margin-top",y.marginTop):"bottom"==t&&L===!0&&e.css("width","").css("top","").css("bottom",0).css("position","absolute").css("left",y.cssLeft).css("margin-top",y.marginTop).css("margin-bottom",y.marginBottom),I&&I.remove()}function c(t){if(t.getBoundingClientRect)return t.getBoundingClientRect().top;var e=0;if(t.offsetParent)do e+=t.offsetTop,t=t.offsetParent;while(t);return e}function p(t){return t.offsetTop+t.clientHeight}function l(t){if("true"===t){var e=h.offsetHeight,o=window.innerHeight;return o-(e+parseInt(H))<0}return!1}var d,u,m,h,g,w,v,y,b,C,x,T,k,H,W,L,M,P,B,I;switch(C=!1,x=!1,P=window.matchMedia,g=angular.element(window),w=angular.element(document.body),h=e[0],v=document.documentElement,d=o.mediaQuery||!1,u=o.stickyClass||"",m=o.bodyClass||"",B=void 0==o.useplaceholder?!1:!0,b=e.attr("style")||"",H="string"==typeof o.offset?parseInt(o.offset.replace(/px;?/,"")):0,W="string"==typeof o.anchor?o.anchor.toLowerCase().trim():"top",L="string"==typeof o.confine?o.confine.toLowerCase().trim():"false",L="true"===L,y={top:e.css("top"),width:e.css("width"),position:e.css("position"),marginTop:e.css("margin-top"),cssLeft:e.css("left")},W){case"top":case"bottom":break;default:W="top"}g.on("scroll",n),g.on("resize",t.$apply.bind(t,s)),t.$on("$destroy",i),M=c(h),t.$watch(function(){return x?M:M="top"===W?c(h):p(h)},function(t,o){if((t!==o||"undefined"==typeof T)&&0!==t){T=t-H,L&&e.parent().css({position:"relative"});var s=e.parent()[0],i=parseInt(s.offsetHeight),r=parseInt(e.css("margin-bottom").replace(/px;?/,""))||0;k=i-(h.offsetTop+h.offsetHeight)+H+r,n()}})}return{restrict:"A",link:t}}),window.matchMedia=window.matchMedia||function(){var t="angular-sticky: This browser does not support matchMedia, therefore the minWidth option will not work on this browser. Polyfill matchMedia to fix this issue.";return window.console&&console.warn&&console.warn(t),function(){return{matches:!0}}}()}();

},{}],52:[function(require,module,exports){
//! moment.js
//! version : 2.12.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function isObject(input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale');
                config = mergeConfigs(locales[name]._config, config);
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    config = mergeConfigs(locales[config.parentLocale]._config, config);
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet');
                }
            }
            locales[name] = new Locale(config);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale;
            if (locales[name] != null) {
                config = mergeConfigs(locales[name]._config, config);
            }
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return Object.keys(locales);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        return isArray(this._months) ? this._months[m.month()] :
            this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')$', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')$', 'i');
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             if (this.isValid() && other.isValid()) {
                 return other < this ? this : other;
             } else {
                 return valid__createInvalid();
             }
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)W)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this > +localInput;
        } else {
            return +localInput < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this < +localInput;
        } else {
            return +this.clone().endOf(units) < +localInput;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return +this === +localInput;
        } else {
            inputMs = +localInput;
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = local__createLocal([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = getSet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = getSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto._months           = defaultLocaleMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto._monthsShort      = defaultLocaleMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto._monthsRegex      = defaultMonthsRegex;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto._monthsShortRegex = defaultMonthsShortRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.12.0';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}]},{},[1]);
