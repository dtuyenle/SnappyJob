(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.oeMasonry = {
        caller: function() {
            var $container = $('#msnry').masonry({
                itemSelector: '.oe-msnry-item',
                columnWidth: '.oe-msnry-grid',
                gutter: '.oe-msnry-gutter'
            });
            var $msnryItem = $('.oe-msnry-item');
            var classHide  = 'oe-msnry-hidden';

            // Layout Masonry again after all images have loaded
            $container.imagesLoaded( function() {
                $container.masonry();

                $doc.on('click', '.oe-msnry-filter', function() {
                     var $this = $(this);
                     $('.oe-msnry-filter').removeClass('oe-msnry-active');
                     var filter = $this.addClass('oe-msnry-active').attr('data-msnry-filter');
                     if(!filter || filter == 'all') {
                         $msnryItem.removeClass(classHide);
                     } else {
                         $msnryItem.filter('[data-msnry-cate~="'+ filter +'"]').removeClass(classHide);
                         $msnryItem.not('[data-msnry-cate~="'+ filter +'"]').addClass(classHide);
                     }
                    $container.masonry();
                });
            });
        },
        timeline: function() {
            // Translate $-placeholder to `left` and `right`
            $('.oe-timeline-container').masonry('on', 'layoutComplete', function(msnry, items) {
                $.each(items, function(idx, item) {
                    var loc = item.position.x ? 'right' : 'left'
                      , iLoc = item.position.x ? 'left' : 'right'
                      , $el = $(item.element);

                    $el.find('*').add($el).each(function(idx, el) {
                        el.className = el.className
                                      .replace('$$', iLoc)
                                      .replace('$', loc)
                    })
                })
            })
        }
    };
})(jQuery, window.OE, window.document);
