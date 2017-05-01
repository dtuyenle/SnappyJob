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


