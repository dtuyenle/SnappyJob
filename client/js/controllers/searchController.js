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

    setTimeout(function() {
        $("input#search-location")
        .geocomplete()
        .bind("geocode:result", function(event, result){
            $scope.searchService.address = result.formatted_address;
            // console.log(result);
        });

    }, 2000)

}