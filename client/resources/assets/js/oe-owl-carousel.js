(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // apply attribute
    OE.owlCarousel = {
        applyCarousel: function() {
            $('.oe-owl-carousel').each(function() {
                var $this                 = $(this),
                    $itemDesktopLarge     = $(this).attr('data-item-desktop-large') || 5,
                    $itemDesktop         = $(this).attr('data-item-desktop') || 5,
                    $itemTablet         = $(this).attr('data-item-tablet') || 3,
                    $itemMobile         = $(this).attr('data-item-mobile') || 1,
                    $navigation         = $(this).attr('data-navigation') == 'true',
                    $pagination         = $(this).attr('data-pagination') == 'true',
                    $navigationClass    = $(this).attr('data-navigation-class') || '';

                var navigationText = ['<div class="'+$navigationClass+'"><button class="btn oe-btn"><i class="fa fa-arrow-left"></i></button></div>'
                                      ,'<div class="'+$navigationClass+'"><button class="btn oe-btn"><i class="fa fa-arrow-right"></i></button></div>']

                $this.owlCarousel({

                    // Most important owl features
                    items : $itemDesktopLarge,
                    itemsCustom : false,
                    itemsDesktop : [1199,$itemDesktop],
                    itemsDesktopSmall : false,
                    itemsTablet: [991,$itemTablet],
                    itemsTabletSmall: false,
                    itemsMobile : [767,$itemMobile],
                    singleItem : false,
                    itemsScaleUp : false,

                    //Basic Speeds
                    slideSpeed : 200,
                    paginationSpeed : 800,
                    rewindSpeed : 1000,

                    //Autoplay
                    autoPlay : false,
                    stopOnHover : false,

                    // Navigation
                    navigation : $navigation,
                    navigationText : navigationText,
                    rewindNav : true,
                    scrollPerPage : false,

                    //Pagination
                    pagination : $pagination,
                    paginationNumbers: false,

                    // Responsive
                    responsive: true,
                    responsiveRefreshRate : 200,
                    responsiveBaseWidth: window,

                    // CSS Styles
                    baseClass : "owl-carousel",
                    theme : "owl-theme",

                    //Lazy load
                    lazyLoad : false,
                    lazyFollow : true,
                    lazyEffect : "fade",

                    //Auto height
                    autoHeight : false,

                    //JSON
                    jsonPath : false,
                    jsonSuccess : false,

                    //Mouse Events
                    dragBeforeAnimFinish : true,
                    mouseDrag : true,
                    touchDrag : true,

                    //Transitions
                    transitionStyle : false,

                    // Other
                    addClassActive : false,

                    //Callbacks
                    beforeUpdate : false,
                    afterUpdate : false,
                    beforeInit: false,
                    afterInit: false,
                    beforeMove: false,
                    afterMove: false,
                    afterAction: false,
                    startDragging : false,
                    afterLazyLoad : false

                })
            });
        }
    };
})(jQuery, window.OE, window.document);
