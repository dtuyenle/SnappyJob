'use strict';

module.exports = function(
    $scope,$http,$location,$sce, $timeout,
    searchService,geoService,contentService,bookmarkService,
    filterService,navService,twitterService,localStorageService,newsService
) {

    $scope.searchService        = searchService;
    $scope.geoService           = geoService;
    $scope.contentService       = contentService;
    $scope.filterService        = filterService;
    $scope.navService           = navService;
    $scope.bookmarkService      = bookmarkService;
    $scope.twitterService       = twitterService;
    $scope.localStorageService  = localStorageService;
    $scope.newsService          = newsService;
    navService.view = 'wall';
    searchService.skip = 0;

    $scope.busy             = false;
    $scope.latest_contents_original = [];
    $scope.latest_contents_page = 1;
    $scope.latest_contents  = [];
    $scope.total_page = 0;
    $scope.contents         = [];
    $scope.start_news = 0;

    $scope.notfound         = false;
    $scope.news_limit = 1;
    $scope.news_offset = 0;

    $scope.nextPage = function() {
        if ($scope.busy || 
            $scope.contentService.contents.length + $scope.contentService.bad_contents.length === $scope.contentService.total || 
            $scope.contentService.contents.length + $scope.contentService.bad_contents.length > $scope.contentService.total) {
            return;
        }
        $scope.busy = true;

        $scope.start_news = $scope.contents.length;

        $scope.contentService.load({
            limit   : searchService.limit,
            skip    : searchService.skip,
            lat     : geoService.lat,
            lon     : geoService.lon,
            jobtitle: searchService.jobtitle
        },function(contents){
            if($scope.contentService.contents.length === 0) { $scope.contents = []; }            
            else {
                if(searchService.search == true) { $('.search-close').click(); searchService.search = false ; }
                _.each(contents,function(content){
                    $scope.contents.push(content.content);
                })
                searchService.skip  = searchService.skip + 10;
                $scope.busy         = false;
            }
            if($scope.contents.length === 0){ $scope.notfound = true; }
            $scope.getNews();
        })
    }


    $scope.addScrollLatestContent = function(){
        $(window).on('scroll',function(){
            if($('twitter-search').length == 0) { return }
            if(parseInt($(this).scrollTop()) < 650) {
                var top = $('#twitter-search').offset().top + $('#twitter-search').height();
                $('.oe-sidebar-nav').css({
                    'zIndex': '-1',
                    'margin-top' : '0px'
                })
            }
            else {
                $('.oe-sidebar-nav').css({
                    'zIndex': '1',
                    'margin-top': '0px'
                })
            }
        })
    }


    $scope.getLatestContents = function() {
        $scope.filterService.getLatest(1000,function(contents){
            _.each(contents,function(content){
                $scope.latest_contents_original.push(content.content);
            })
            $scope.total_page = Math.ceil($scope.latest_contents_original.length / 4) - 1;
            $scope.latest_contents = $scope.latest_contents_original.slice(1,5);
        }) 
    }

    $scope.nextLatestContents = function() {
        if($scope.latest_contents_page === $scope.total_page) { return }
        $scope.latest_contents_page = 1 + $scope.latest_contents_page;
        var start   = $scope.latest_contents_page * 4;
        var stop    = start + 4; 
        $scope.latest_contents = $scope.latest_contents_original.slice(start, stop);
    }

    $scope.prevLatestContents = function() {
        if($scope.latest_contents_page === 1) { return }
        $scope.latest_contents_page = $scope.latest_contents_page - 1;
        var start   = $scope.latest_contents_page * 4;
        var stop    = start + 4; 
        $scope.latest_contents = $scope.latest_contents_original.slice(start, stop);
    }


    $scope.getTwitterWidget = function() {
        $scope.twitterService.get(function(){
            //var $ = function (id) { return document.getElementById(id); };
            function loadTwitter() {
                if (typeof twttr === 'undefined') {
                    (function() {
                        window.twttr = (function (d, s, id) {
                            var t, js, fjs = d.getElementsByTagName(s)[0];
                            if (d.getElementById(id)) return; js = d.createElement(s); js.id = id;
                            js.src = "//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
                            return window.twttr || (t = { e: [], ready: function (f) { t.e.push(f) } });
                            } (document, "script", "twitter-wjs"));                    

                    })();
                } else {
                    $timeout = twttr.widgets.load();
                };
            }
            //var twitter = $('twitter-wjs');
            //twitter.remove();
            loadTwitter();
        });
    }

    $scope.getNews = function () {
        if($scope.news_offset !== 0) {
            $scope.news_offset = $scope.news_offset + 1;
        }
        else {
            $scope.news_offset = 1;
        }
        var j = 0;
        $scope.newsService.get($scope.news_limit, $scope.news_offset, function(news){
            if(news.news.length === 0) { return; }
            for(var i = $scope.start_news, length = $scope.contents.length; i < length; i++) {
                if(i % 10 == 0 && j < 1 && i !== 0) {
                    $scope.contents.splice(i, 0, news.news[j]);
                    j = j + 1;
                }
            }
        })
    }

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };
    

}
