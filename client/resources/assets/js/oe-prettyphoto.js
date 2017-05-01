(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.prettyPhoto = {
        run: function() {
            $("a[data-rel^='prettyPhoto']").prettyPhoto({
                hook: 'data-rel'
            });
        }
    };
})(jQuery, window.OE, window.document);
