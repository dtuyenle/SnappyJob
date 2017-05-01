
var Authentication = require(__base + 'middleware/authentication')

module.exports = function(app, passport) {

	// show the main app
    /*app.get('/app', Authentication.isLoggedIn, function(req, res) {
        res.render('../client/index.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', Authentication.isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });*/

    // show the home page
    app.get('/', function(req, res) {
        res.render('../client/index.ejs');
    });

}