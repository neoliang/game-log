var express = require('express'),
	path = require('path'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = express.Router(),
	router = express.Router();
	
module.exports = function(app){	
	eventStatiticsController = require('./controllers/event_statistic_controller')(app);
	//post game log event statistic
	router.post('/err_log', eventStatiticsController.post_event);


	router.get('/*', function(req, res) {
		console.log('get static file',req.path);
		res.sendFile(rootPath + 'public/' + req.path );
	});

	apiRouter.get('/logs',eventStatiticsController.view_day_event)

	app.use('/api', apiRouter);
	app.use('/', router);

};

