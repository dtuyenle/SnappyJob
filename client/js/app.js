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
