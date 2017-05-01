'use strict';

module.exports = function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
            jQuery('#jstwitter').gridalicious({
                gutter: 13, 
                width: 200, 
                animate: true
            });   
        }, 1);
    };
}
