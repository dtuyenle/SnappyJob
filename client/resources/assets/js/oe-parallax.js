(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.parallax = {
        caller: function() {
            $.stellar({
                horizontalScrolling: false
            });
        }
    };
})(jQuery, window.OE, window.document);
