
$(function() {
    'use strict';
    // Main Methods
    OE.siteLoading();
    OE.fixedHeader();
    OE.searchBox();
    OE.mobileMenu();
    OE.menuArrange();
    OE.videoHeight();

    // Chart
    OE.chart.caller();

    // Flex Slider
    OE.flexslider.caller();

    // Counter
    OE.counter.caller();

    // Masonry
    OE.oeMasonry.caller();
    OE.oeMasonry.timeline();

    // Pretty Photo
    OE.prettyPhoto.run();

    // Parallax
    OE.parallax.caller();

    // Countdown
    OE.countdown.caller();

    // Video Background
    OE.videobg.caller();

    // Audio
    OE.audio.caller();

    // Owl Carousel
    OE.owlCarousel.applyCarousel();

    // Testimonial
    OE.testimonial.caller();
});
