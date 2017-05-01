(function($, OE, document){
    'use strict';
    var ev = new $.Event('classadded'),
        orig = $.fn.addClass;
    $.fn.addClass = function() {
        $(this).trigger(ev, arguments);
        return orig.apply(this, arguments);
    }

    var $doc = $(document);

    // Common functions
    OE.counter = {
        caller: function() {
            $('.oe-shortcode-section').bind('classadded', function() {
                $(this).find('.oe-content-boxes-counter').each(function() {
                    var $this = $(this),
                        $ele = $this.find('[data-countup-selector]').attr('data-countup-selector'),
                        duration = 2.5;

                    new countUp($ele, $this.attr('data-counter-from'), $this.attr('data-counter-to'), 0, duration, {
                        useEasing : true,
                        useGrouping : true,
                        separator : '',
                        decimal : '.'
                    }).start();
                });
            });

        }
    };
})(jQuery, window.OE, window.document);
