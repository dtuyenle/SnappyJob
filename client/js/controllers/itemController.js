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

    // get salary for range
    var getSalaryRange = function(content) {
        var salary = content.salary;
        var to_ = salary[salary.length - 1].replace('$','');
        var from_ = salary[0].replace('$','');
        var mid = [];
        mid.push(salary[Math.round(salary.length/2)].replace('$',''));
        mid.push(salary[Math.round(salary.length/2) - 1].replace('$',''));

        $('#salary').jRange({
            from: parseInt(from_),
            to: parseInt(to_),
            step: 1,
            scale: salary,
            format: '$%s',
            width: 300,
            theme: "theme-blue",
            showLabels: true,
            isRange: true,
            disable: true
        });

        $('#salary').jRange('setValue', mid.join(','));
    }

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
	    });

        getSalaryRange(content);

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

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

}


