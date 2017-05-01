// env
require('dotenv').config({path: __dirname + '/.env'})

// set up
var flash      = require('connect-flash');
var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');

var cookieParser= require('cookie-parser');
var bodyParser  = require('body-parser');
var session     = require('express-session');
var multer      = require('multer');
var compression = require('compression');
var log4js      = require("log4js");
var morgan      = require("morgan");
var fs          = require('fs');
var passport    = require('passport');


// base path
//https://gist.github.com/branneman/8048520
global.__rootbase   = __dirname + '/';
global.__base       = __dirname + '/app/';
global.__assetbase  = __dirname + '/uploads/';

// log
var logger = require('./config/logger.js');

// config
var configDB = require('./config/database.js');

// configuration 
mongoose.connect(configDB.url);

// limit upload size
app.use(bodyParser.json({ limit: '5mb' }));

// set up our express application
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// template
app.set('view engine', 'ejs');

// enabling GZip compression.
app.use(compression({
  threshold: 512
}));

// logger
var theAppLog = log4js.getLogger();
var theHTTPLog = morgan({
    "format": "default",
    "stream": {
        write: function(str) { 
            theAppLog.debug(str);
            fs.appendFile(__dirname + '/log/access.log', str, function (err) {
                theAppLog.debug(err);
            });
        }
    }
});
app.use(theHTTPLog);

// public directory
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/client'));

// passport
//require('./config/passport')(passport);
// session
/*var MongoStore = require('connect-mongo')(session);
require('./config/passport')(passport);
app.use(session({ 
  secret: 'quietpeacefulisntithateful',
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());
*/
// routes
require('./app/routes/routes.js')(app,passport);

// port
var port = process.env.PORT;

// launch
// https for prod
if(process.env.NODE_ENV == 'production') {
    var https   = require('https');
        https.createServer({
            key: fs.readFileSync('./cert/snappyjob.key.rsa'),
            cert: fs.readFileSync('./cert/cert.pem'),
            ca: fs.readFileSync('./cert/ca.pem')
        }, app).listen(port);
        // Redirect from http port 80 to https
        var http = require('http');
        http.createServer(function (req, res) {
            res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
}

// http for dev
if(process.env.NODE_ENV == 'development') {
    app.listen(port);
}

console.log('Running on ' + port);

module.exports = app;




