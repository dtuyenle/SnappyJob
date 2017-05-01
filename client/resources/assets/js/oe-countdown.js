(function($, OE, document){
    'use strict';
    var $doc = $(document);

    // Common functions
    OE.countdown = {
        caller: function() {
            if($('.oe-comming-soon')[0]) { // Don't run it if we dont have it (Hmm, is it work?)
                $('.oe-comming-soon').each(function() {
                    var $this = $(this),
                        $dateData = $this.attr('data-comming-soon'),
                        $eleDay = $this.find('.oe-comming-day'),
                        $eleHour = $this.find('.oe-comming-hour'),
                        $eleMin = $this.find('.oe-comming-min'),
                        $eleSecond = $this.find('.oe-comming-sec'),
                        $current = new Date();

                        var arrDate = $dateData.split('-');
                        $target = new Date(parseInt(arrDate[0]), parseInt(arrDate[1])-1, parseInt(arrDate[2]));

                        $time = ($target.getTime() - $current.getTime())/1000;
                        $timeRemain = $time;

                        var $days = Math.floor($time/(60*60*24));
                        $timeRemain = $time % (60*60*24);
                        var $hours = Math.floor($timeRemain/(60*60));
                        $timeRemain = $timeRemain % (60*60);
                        var $mins = Math.floor($timeRemain/60);
                        $timeRemain = $timeRemain % 60;
                        var $seconds = Math.floor($timeRemain);

                        // SET CURRENT TIME
                        $eleSecond.html($seconds);
                        $eleMin.html($mins);
                        $eleHour.html($hours);
                        $eleDay.html($days);

                        // CALL COUNT DOWN
                        countdown();

                        function countdown() {
                            var t = setInterval(function() {
                                $seconds--;
                                var flagMin = false;
                                var flagHour = false;
                                var flagDay = false;

                                if($seconds<0) {
                                    $seconds = 59;
                                    $mins--;
                                    flagMin = true;
                                }
                                if($mins<0) {
                                    $mins = 59;
                                    $hours--;
                                    flagHour = true;
                                }
                                if($mins<0) {
                                    $hours = 23;
                                    $days--;
                                    flagDay = true;
                                }

                                // FINISH RESET
                                if($days<0) {
                                    clearInterval(t);

                                    $seconds = 0;
                                    $mins = 0;
                                    $hours = 0;
                                    $days = 0;
                                    flagMin = true;
                                    flagHour = true;
                                    flagDay = true;
                                }

                                $eleSecond.html($seconds);
                                flagMin && $eleMin.html($mins);
                                flagHour && $eleHour.html($hours);
                                flagDay && $eleDay.html($days);
                            }, 1000);
                        }
                });
            }
        }
    };
})(jQuery, window.OE, window.document);
