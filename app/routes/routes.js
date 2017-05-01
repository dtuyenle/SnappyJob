var Authentication = require(__base + 'middleware/authentication')

module.exports = function(app, passport) {


// index routes ===============================================================
    require('./indexRoutes.js')(app,passport)    

// authenticate routes ========================================================
    //require('./authenticateRoutes.js')(app,passport)

// Content Model routes =======================================================
    require('./contentRoutes.js')(app,passport)

// Tag Model routes =======================================================
    require('./tagRoutes.js')(app,passport)

// Location Model routes =======================================================
    require('./locationRoutes.js')(app,passport)

// Apply Model routes =======================================================
    require('./applyRoutes.js')(app,passport)

// Contactus Model routes =======================================================
    require('./contactusRoutes.js')(app,passport)

// Asset Model routes =======================================================
    require('./assetRoutes.js')(app,passport)

// Twitter Model routes =======================================================
    require('./twitterRoutes.js')(app,passport)

// Iframe Model routes =======================================================
    require('./iframeRoute.js')(app,passport)

// News Model routes =======================================================
    require('./newsRoutes.js')(app,passport)

// Tips Model routes =======================================================
    require('./tipsRoutes.js')(app,passport)


};
