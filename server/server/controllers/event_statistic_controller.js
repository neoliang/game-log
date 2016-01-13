


var fs = require('fs');
var path = require('path');
var log_root_dir = '/tmp';
var cfg = {};

var join_array = function  (files) {
	var str = "";
	for (var i = files.length - 1; i >= 0; i--) {
		str += files[i];
	}
	return str;
};

var mkdir_rec = function  (dir) {
	var parent_dir = path.dirname(dir);
	if (parent_dir && !fs.existsSync(parent_dir)) {
		mkdir_rec(parent_dir);
	};
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir,0744);
	};
	
};

var getDayLogs = function  (year,month,day,cb) {
	var day_log_file = path.join(log_root_dir,year.toString(),month.toString(),day.toString());
	day_log_file += '.json';
	fs.readFile(day_log_file,"utf8",function  (err,data) {
		cb(err,data);
	});
};


var view_day_event = function  (req,res) {
	var date = new Date(req.query.date);
	getDayLogs(date.getFullYear().toString(),date.getMonth().toString(),date.getDate().toString(),function  (err,data) {
		if (err) {
			res.json({datas:[],display: cfg.log_dis});
		} else{
			var jData = JSON.parse(data);
			res.json({datas:jData,display: cfg.log_dis});
		};

	});
	
};

var post_event = function  (req, res) {
	var model = req.body;
	var now = new Date();
	var year = now.getFullYear().toString();
	var month = now.getMonth().toString();
	var day = now.getDate().toString();
	var current_log_dir = path.join(log_root_dir,year,month);
	mkdir_rec(current_log_dir);
	var contents = [];
	var log_file = path.join(current_log_dir,day+'.json');
	if (fs.existsSync(log_file)) {
		contents = JSON.parse(fs.readFileSync(log_file));
	}
	var content = {
		"date":now.toString(),
		"content":model
	};
	contents.push(content);
	fs.writeFileSync(log_file,JSON.stringify(contents));
	res.json(contents);
};

module.exports = function(app){	
	cfg = app.get('cfg');
	log_root_dir = app.get('cfg').log_root_dir
	if(!fs.existsSync(log_root_dir))
	{
		mkdir_rec(log_root_dir);
	}
	return{
		view_day_event: view_day_event,
		post_event: post_event,
	};
}
