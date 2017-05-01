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