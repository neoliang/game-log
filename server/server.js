
var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  morgan = require('morgan'),
	cors = require('cors'),
	fs = require('fs'),
	app = express();
// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./server/env')[env];

var cfg = JSON.parse(fs.readFileSync(envConfig.cfg));
console.log(cfg);

// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.set('cfg',cfg);

// ROUTES
require('./server/routes')(app);

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});