(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.testimonial = {
        caller: function() {
            $doc.on('click', '.tab-content .oe-pagination li a', function() {
                var $t = $(this),
                    $tc = $t.parents('.oe-testimonials-content'),
                    $tcActive = $tc.children('div[class="tab-pane active"]'),
                    $tcCurrent = null;

                if($t.hasClass('prev')) {
                    if($tcActive.prev().hasClass('tab-pane')) {
                        $tcCurrent = $tcActive.prev();
                        $tcCurrentAfter = $tcCurrent.prev();
                    }
                }

                if($t.hasClass('next')) {
                    if($tcActive.next().hasClass('tab-pane')) {
                        $tcCurrent = $tcActive.next();
                        $tcCurrentAfter = $tcCurrent.next();
                    }
                }

                if($tcCurrent) {
                    $tcActive.removeClass('active').fadeOut();
                    $tcCurrent.addClass('active').fadeIn();

                    var tid = $tcCurrent.attr('id');
                    var $nav = $tc.prev('.oe-tabs-testimonials');
                    $nav.find('.active').removeClass('active');
                    $nav.find('a[href="#'+ tid +'"]').parent().addClass('active');

                    if( ! $tcCurrentAfter.hasClass('tab-pane')) {
                        $t.parents('ul').children('.active').removeClass('active');
                        $t.parent().addClass('active');
                    }
                }
            });
        }
    };
})(jQuery, window.OE, window.document);
