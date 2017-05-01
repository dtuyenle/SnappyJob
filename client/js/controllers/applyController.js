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