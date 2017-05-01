(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.audio = {
        caller: function() {
            $('.oe-audio-player-el').mediaelementplayer({
                alwaysShowControls: true,
                features: ['playpause','progress','volume'],
                audioVolume: 'vertical',
                audioWidth: '98%',
                audioHeight: '48',
                iPadUseNativeControls: true,
                iPhoneUseNativeControls: true,
                AndroidUseNativeControls: true
            });

            $doc.on('click', '.oe-audio-share-icon, .oe-audio-menu-icon', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this);
                var prefix = $this.attr('class');
                var selector = prefix.replace(/(.*)-icon/, '$1');
                var $selector = $this.parent().find('.' + selector);

                $('.oe-audio-share, .oe-audio-menu').not($selector).removeClass('oe-audio-visible');
                $this.parent().find('.' + selector).toggleClass('oe-audio-visible');
            });

            $doc.on('click', 'body', function(e) {
                var $target = $(e.target);
                if ( !$target.is('.oe-audio-share') &&
                     !$target.is('.oe-audio-menu') &&
                     !$target.is('.oe-audio-share-icon') &&
                     !$target.is('.oe-audio-menu-icon')
                   ) {
                    $('.oe-audio-share, .oe-audio-menu').removeClass('oe-audio-visible');
                }
            });
        }
    };
})(jQuery, window.OE, window.document);

