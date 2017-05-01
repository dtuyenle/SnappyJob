(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.chart = {
        caller: function() {
            $('.oe-circle-chart').each(function() {
                var $this = $(this),
                    $tracker = $this.find('.oe-color-track'),
                    trackColor = $tracker.css('borderColor'),
                    barColor = $tracker.css('color'),
                    width = $this.width();

                $this.easyPieChart({
                    barColor: barColor,
                    trackColor: trackColor,
                    scaleColor: false,
                    lineWidth: 5,
                    lineCap: 'square',
                    size: width,
                    animate: {
                        duration: 2000,
                        enabled: true
                    },
                    rotate: 180,
                    easing: 'easeOutElastic',
                    onStep: function(from, to, percent) {
                        this.el.children[0].innerHTML = Math.round(percent) + '%';
                    }
                });
            });
        }
    };
})(jQuery, window.OE, window.document);
