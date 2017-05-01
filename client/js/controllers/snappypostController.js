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