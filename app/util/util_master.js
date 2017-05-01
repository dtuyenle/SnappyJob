module.exports = (function() {

	return new function() {

			this.util 				= require('./util');
			this.util_location 		= require('./util_location');
			this.util_email 		= require('./util_email');

			this.get = function(util_name) {
				return this[util_name]
			}
		}

	
})()

