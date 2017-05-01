'use strict';

module.exports = function(
    $scope, $http, $timeout, $location, 
    localStorageService
){
    
    $('.loading-overlay').removeClass('active');

    // errors
    $scope.errors = {};

    // success
    $scope.success = {};

    // state dropdown
	$scope.states = [{"name": "Alabama","abbreviation": "AL"},{"name": "Alaska","abbreviation": "AK"},{"name": "American Samoa","abbreviation": "AS"},{"name": "Arizona","abbreviation": "AZ"},{"name": "Arkansas","abbreviation": "AR"},{"name": "California","abbreviation": "CA"},{"name": "Colorado","abbreviation": "CO"},{"name": "Connecticut","abbreviation": "CT"},{"name": "Delaware","abbreviation": "DE"},{"name": "District Of Columbia","abbreviation": "DC"},{"name": "Federated States Of Micronesia","abbreviation": "FM"},{"name": "Florida","abbreviation": "FL"},{"name": "Georgia","abbreviation": "GA"},{"name": "Guam","abbreviation": "GU"},{"name": "Hawaii","abbreviation": "HI"},{"name": "Idaho","abbreviation": "ID"},{"name": "Illinois","abbreviation": "IL"},{"name": "Indiana","abbreviation": "IN"},{"name": "Iowa","abbreviation": "IA"},{"name": "Kansas","abbreviation": "KS"},{"name": "Kentucky","abbreviation": "KY"},{"name": "Louisiana","abbreviation": "LA"},{"name": "Maine","abbreviation": "ME"},{"name": "Marshall Islands","abbreviation": "MH"},{"name": "Maryland","abbreviation": "MD"},{"name": "Massachusetts","abbreviation": "MA"},{"name": "Michigan","abbreviation": "MI"},{"name": "Minnesota","abbreviation": "MN"},{"name": "Mississippi","abbreviation": "MS"},{"name": "Missouri","abbreviation": "MO"},{"name": "Montana","abbreviation": "MT"},{"name": "Nebraska","abbreviation": "NE"},{"name": "Nevada","abbreviation": "NV"},{"name": "New Hampshire","abbreviation": "NH"},{"name": "New Jersey","abbreviation": "NJ"},{"name": "New Mexico","abbreviation": "NM"},{"name": "New York","abbreviation": "NY"},{"name": "North Carolina","abbreviation": "NC"},{"name": "North Dakota","abbreviation": "ND"},{"name": "Northern Mariana Islands","abbreviation": "MP"},{"name": "Ohio","abbreviation": "OH"},{"name": "Oklahoma","abbreviation": "OK"},{"name": "Oregon","abbreviation": "OR"},{"name": "Palau","abbreviation": "PW"},{"name": "Pennsylvania","abbreviation": "PA"},{"name": "Puerto Rico","abbreviation": "PR"},{"name": "Rhode Island","abbreviation": "RI"},{"name": "South Carolina","abbreviation": "SC"},{"name": "South Dakota","abbreviation": "SD"},{"name": "Tennessee","abbreviation": "TN"},{"name": "Texas","abbreviation": "TX"},{"name": "Utah","abbreviation": "UT"},{"name": "Vermont","abbreviation": "VT"},{"name": "Virgin Islands","abbreviation": "VI"},{"name": "Virginia","abbreviation": "VA"},{"name": "Washington","abbreviation": "WA"},{"name": "West Virginia","abbreviation": "WV"},{"name": "Wisconsin","abbreviation": "WI"},{"name": "Wyoming","abbreviation": "WY"}];
    $scope.state =  typeof(localStorageService.get('post-state')) !== 'undefined' ? localStorageService.get('post-state') ? localStorageService.get('post-state') : "" : "";
    /*$scope.$watch('state', function() {
        localStorageService.set('post-state', $scope.state);
    },true);*/

    // type dropdown
    $scope.types = [{
        name: "Restaurant",
        slug: "restaurant",
    }, {
        name: "Garden",
        slug: "garden",
    }, {
        name: "IT",
        slug: "it",
    }, {
        name: "Creative",
        slug: "creative",
    }, {
        name: "Housework",
        slug: "housework",
    }, {
        name: "Other",
        slug: "other",
    }];
    $scope.type =  typeof(localStorageService.get('post-type')) !== 'undefined' ? localStorageService.get('post-type') ? localStorageService.get('post-type') : "" : "";
    /*$scope.$watch('type', function() {
        localStorageService.set('post-type', $scope.type);
    },true);*/

    $scope.contact = {
        phone: '',
        email: ''
    }
    $scope.contact = typeof(localStorageService.get('post-contact')) !== 'undefined' ? localStorageService.get('post-contact') ? localStorageService.get('post-contact') : "" : "";;
    /*$scope.$watch('contact', function() {
        localStorageService.set('post-contact', $scope.contact);
    },true);*/

    $scope.location = {
        city: '',
        zip: '',
        loc: {
            lat: 0,
            lon: 0
        },
        state: '',
        address: ''
    }
    $scope.location = typeof(localStorageService.get('post-location')) !== 'undefined' ? localStorageService.get('post-location') : "";;
    /*$scope.$watch('location', function() {
        localStorageService.set('post-location', $scope.location);
    },true);*/

    $scope.content = {
        name: '',
        slug: '',
        content_type: '',
        budget: '',
        url: '',
        crawl: false,
        description: '',
        publishedDate: '',
        updatedDate: ''
    }
    $scope.content = typeof(localStorageService.get('post-content')) !== 'undefined' ? localStorageService.get('post-content') : "";;
    /*$scope.$watch('content', function() {
        localStorageService.set('post-content', $scope.content);
    },true);*/


    $scope.toItem = function(id) {
        $location.path("/item/" + $scope.success.content);
    }

    $scope.toJobPost = function() {
        $scope.success = {};
        $location.path("/post");
    }


    $scope.saveInputs = function() {
        localStorageService.set('post-state', $scope.state);
        localStorageService.set('post-type', $scope.type);
        localStorageService.set('post-contact', $scope.contact);
        localStorageService.set('post-location', $scope.location);
        localStorageService.set('post-content', $scope.content);
    }

    $scope.removeInputs = function() {
        localStorageService.remove('post-state');
        localStorageService.remove('post-type');
        localStorageService.remove('post-contact');
        localStorageService.remove('post-location');
        localStorageService.remove('post-content');
    }


    var validation = function() {
        if(!$scope.contact.email.length ||
            !$scope.location.zip.length ||
            !$scope.location.state.length ||
            !$scope.location.city.length ||
            !$scope.location.state.length ||
            !$scope.content.name.length ||
            !$scope.content.budget.length ||
            !$scope.content.content_type.length ||
            !$scope.content.description.length ||
            !$scope.content.content_type.length
        ) {
            return false
        }
        else {
            return true
        }
    }

    $scope.submit = function(){

        $('.loading-overlay').addClass('active');

        // set data for other variables not ited to view
        $scope.location.state       = $scope.state.name ? $scope.state.name : '';
        $scope.content.content_type = $scope.type.name ? $scope.type.name : '';
        $scope.content.slug         = $scope.content.name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        $scope.content.publishedDate= (new Date()).toString();
        $scope.content.updatedDate  = (new Date()).toString();
        if(typeof($scope.location.address) !== 'undefined' ) {
            if($scope.location.address.replace(/ /g,'') === '') {
                $scope.location.address = $scope.location.city + ' ' + $scope.location.state; 
            }
        }
        else {
            $scope.location.address = $scope.location.city + ' ' + $scope.location.state; 
        }

        // validation
        if(!validation()) { return false }

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': $scope.location.address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                // remove error
                $scope.errors = {};

                $scope.location.loc = {};
                $scope.location.loc.lat = results[0].geometry.location.lat();
                $scope.location.loc.lon = results[0].geometry.location.lng();
                
                $http({
                    url: "/contents",
                    method: 'POST',
                    data: {
                        contact     : $scope.contact,
                        location    : $scope.location,
                        content     : $scope.content
                    }
                }).success(function(data, status, headers, config) {
                    $('.loading-overlay').removeClass('active');
                    $scope.success = data;
                    $scope.success.content_url = window.location.protocol + '//' + window.location.host + window.location.pathname + '#/item/' + $scope.success.content;
                    //$scope.$apply();
                    console.log(data);
                }).error(function(data, status, headers, config) {
                    $scope.errors['submit'] = data;
                    $('.loading-overlay').removeClass('active');
                    $scope.$apply();
                    console.log(data);
                });
            }
            else {
                $('.loading-overlay').removeClass('active');
                // add error
                $scope.errors['location'] = 'Please make sure you entered correct location.';
                $scope.tab = 3;
                $scope.$apply();
            }
        })
    
    }


}


