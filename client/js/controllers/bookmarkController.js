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