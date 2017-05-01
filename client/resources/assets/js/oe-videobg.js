(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.videobg = {
        caller: function() {
            $('.oe-page-videobg').each(function() {
                var $this = $(this),
                $fullwidth = $this.attr('data-fullwidth'),
                videoElement = $this.find('.oe-videobg-video'),
                controlElement = $this.find('.oe-videobg-control'),
                pauseElement = $this.find('.oe-page-videobg'),
                controlButton = $this.find('.oe-videobg-control-btn'),
                videoElementId = videoElement.attr('id');

                if(videoElementId == '') return;
                var options = {
                    enableAutosize: true,
                    loop: false,
                    features: [],
                    alwaysShowControls: false,
                    iPadUseNativeControls: false,
                    iPhoneUseNativeControls: false,
                    AndroidUseNativeControls: false,
                    alwaysShowHours: false,
                    showTimecodeFrameCount: false,
                    success: function (mediaElement, domObject) {

                        // call the play method
                        mediaElement.pause();

                        // add event listener
                        mediaElement.addEventListener('play', function(e) {
                            $(controlElement).fadeOut(300);
                        }, false);
                        mediaElement.addEventListener('pause', function(e) {
                            $(controlElement).fadeIn(300);
                        }, false);
                        mediaElement.addEventListener('ended', function(e) {
                            $(controlElement).fadeIn(300);
                        }, false);
                    },
                };

                if($fullwidth) {
                    options.videoWidth = '100%';
                    options.videoHeight = '100%';
                }

                var player = new MediaElementPlayer('#'+videoElementId, options);
                $(controlButton).bind('click', function(e) {
                    player.play();
                    e.preventDefault();
                    e.stopPropagation();
                });
                $(pauseElement).bind('click', function(e) {
                    player.pause();
                    e.preventDefault();
                    e.stopPropagation();
                });
            })
        }
    };
})(jQuery, window.OE, window.document);
