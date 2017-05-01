

module.exports = new function() {

	this.isLoggedIn = function(req, res, next) {
	    if (req.isAuthenticated())
	        return next();

	    res.redirect('/');
	}

}
