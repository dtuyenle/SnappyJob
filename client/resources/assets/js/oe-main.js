(function(window, $){
    'use strict';
    var $doc = $(document);

    // Common functions
    var OE = {
        searchBox: function() {
            $doc.on('click', '[data-toggle-active]', function() {
                var $this = $(this),
                    selector = $this.attr('data-toggle-active'),
                    $selector = $(selector);

                $selector.toggleClass('active');
                var focus = $this.attr('data-focus');
                if(focus) {
                    $(focus).focus();
                }
            });
        },

        fixedHeader: function() {
            if( $('.header-fixed')[0] ) {
                var scrollAnchor = 0;
                var $header = $('.header-fixed');
                var $headType = $('.oe-header');

                var headHeight = $headType.height();
                var pos = $header.attr('data-sticky-pos') ? $header.attr('data-sticky-pos') : headHeight;

                if($headType.hasClass('oe-header-basic')
                  || $headType.hasClass('oe-header-style2')
                  || $headType.hasClass('oe-header-style3')
                  ) {
                    $('body').css({'marginTop': headHeight});
                }

                if($(window).scrollTop() > pos) {
                    $header.addClass('header-sticky');
                }

                $(window).on('scroll DOMMouseScroll', function() {
                    var scrollTop = $(window).scrollTop();

                    if(scrollTop - scrollAnchor >= 50 || scrollTop - scrollAnchor <= -50 ) {
                        scrollAnchor = scrollTop;

                        if(scrollTop > pos) {
                            $header.addClass('header-sticky');
                        } else {
                            $header.removeClass('header-sticky');
                        }
                    }

                });

            }
        },

        siteLoading: function() {
            var $loading = $('.loading-overlay');
            $(window).load(function() {
                $loading.removeClass('active');
            });
        },
        mobileMenu: function() {
            $doc.on('click', '.navbtn', function() {
                $('.oe-mobile-menu').slideToggle(300);
            });

            $('.oe-mobile-menu .menu-item-has-child').on('click', '> a', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.parent().toggleClass('active');
                $this.next('.submenu').slideToggle(300);
            });

            $('.uk-nav-offcanvas .menu-item-has-child').on('click', '> a', function(e) {
                e.preventDefault();
                var $this = $(this);
                $this.parent().toggleClass('active');
                $this.next('.submenu').slideToggle(300);
            });
        },

        menuArrange: function() {
            var $extraMenu = $('.oe-header-extra');
            var extraWide = 0;

            $extraMenu.children().each(function(){
                extraWide += $(this).outerWidth(true);
            })
            $extraMenu.css({'width': extraWide});
            $('.menu-header').find('.oe-mainmenu').css({'margin-right': extraWide});
        },

        videoHeight: function() {
            $('.oe-page-videobg[data-video-height]').each(function() {
                var $this = $(this);
                $this.css({'height': $this.attr('data-video-height')});
            });
        }
    };

    // Make it global
    window.OE = OE;
})(window, jQuery);
