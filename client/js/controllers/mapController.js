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