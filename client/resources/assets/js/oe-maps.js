(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.maps = {
        caller: function() {
            $('.oe-maps').each(function() {
                var $this = $(this),
                    $id = $this.attr('id'),
                    $mapType = $this.attr('data-maps-style') || 'standard',
                    $lat = $this.attr('data-maps-lat'),
                    $lng = $this.attr('data-maps-lng'),
                    $zoom = parseInt($this.attr('data-maps-zoom')),
                    $color = $this.attr('data-maps-color'),
                    $scroll = $this.attr('data-maps-scroll'),
                    $navigation = $this.attr('data-maps-navigation'),
                    $scale = $this.attr('data-maps-scale'),
                    $dragable = $this.attr('data-maps-dragable'),
                    $scrollwheel = $this.attr('data-maps-scrollwheel'),
                    $marker = $this.attr('data-maps-marker');

                var mapOptions = {
                  center: new google.maps.LatLng($lat, $lng),
                  zoom: $zoom,
                  styles: MAPS_CONFIG[$mapType]
                };

                if($scroll && $scroll != '')             mapOptions.scrollwheel = $scroll === 'true';
                if($navigation && $navigation != '')     mapOptions.navigationControl = $navigation === 'true';
                if($scale && $scale != '')                 mapOptions.scaleControl = $scale === 'true';
                if($dragable && $dragable != '')         mapOptions.draggable = $dragable === 'true';
                if($scrollwheel && $scrollwheel != '')     mapOptions.scrollwheel = $scrollwheel === 'true';

                var map = new google.maps.Map(document.getElementById($id), mapOptions);

                if($marker && $marker != '') {
                    var beachMarker = new google.maps.Marker({
                        position: new google.maps.LatLng($lat, $lng),
                        map: map,
                        icon: $marker
                    });
                }
            });
        }
    };
})(jQuery, window.OE, window.document);

$(function() {
    'use strict';
    OE.maps.caller();
});

// MAPS STYLE CONFIG
MAPS_CONFIG = {
    standard: [],

    // GRAY STYLE
    gray: [
        // BASIC
        {
            "stylers": [
                { hue: "#B9B9B9" },
                { saturation: -100 }
            ]
        },

        // Lanscape
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "color": "#E5E5E5"
                }
            ]
        },

        // Water
        {
            "featureType": "water",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#DCDCDC"
                }
            ]
        },

        // Transit
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#B9B9B9"
                }
            ]
        },

        // Road hight way
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#E2E2E2"
                }
            ]
        },
        // Road hight way control access
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ACACAC"
                }
            ]
        },

        // Road arterial
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },

        // Road local
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#F6F6F6"
                }
            ]
        },

        // Point global
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#DDDDDD"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#D3D3D3"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#DBDBDB"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#DBDBDB"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#DBDBDB"
                }
            ]
        },
    ],


    // Blue STYLE
    blue: [
        // BASIC
        {
            "stylers": [
                { hue: "#4C95B2" },
                { saturation: -100 }
            ]
        },

        // Lanscape
        {
            "featureType": "landscape",
            "stylers": [
                {
                    "color": "#DEE7EB"
                }
            ]
        },

        // Water
        {
            "featureType": "water",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#BBE7F9"
                }
            ]
        },

        // Transit
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#86CEEB"
                }
            ]
        },
        // Road hight way
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#C2EDFF"
                }
            ]
        },
        // Road hight way control access
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#4DCDFF"
                }
            ]
        },

        // Road arterial
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },

        // Road local
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#F3F7F9"
                }
            ]
        },

        // Point global
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#C6E5F1"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#B7DDEC"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#D5DDE0"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#D5DDE0"
                }
            ]
        },
        {
            "featureType": "poi.place_of_worship",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#D5DDE0"
                }
            ]
        },
    ]

};
