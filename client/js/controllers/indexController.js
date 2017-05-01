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