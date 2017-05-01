var winston = require('winston');
var winston = new (winston.Logger)({  
	transports: [
		new (winston.transports.Console)({ level: process.env.LOG_LEVEL, timestamp: true }),
		new (winston.transports.File)({ filename: __rootbase + '/log/app.log', level: process.env.LOG_LEVEL, timestamp: true })
	]
});

module.exports = winston;