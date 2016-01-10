
exports.install = function() {
	F.route('/', home_page);
	F.route('/{year}/', view_allMonthsForYear);
	F.route('/{year}/{month}/', view_allDaysForYearAndMonth);
	F.route('/{year}/{month}/{day}/',viewDayLogs);
	F.route('/err_log/',err_log,['post']);
	F.route("/api/logs/",view_days);
}

var log_root_dir = CONFIG('log_root_dir')
var fs = require('fs')
var path = require('path')

var cfg = JSON.parse(fs.readFileSync('./config.json'));
console.log(cfg);

function join_array (files) {
	var str = "";
	for (var i = files.length - 1; i >= 0; i--) {
		str += files[i];
	}
	return str;
}
function home_page () {
	var self = this;
	self.layout('layout_log');
	self.view('index');
}
function view_allyears () {
	var self = this;
	fs.readdir(log_root_dir,function  (err,files) {
		self.layout('layout');
		self.view('years',{ years: files });
	})
}

function view_allMonthsForYear (year) {
	var self = this;
	fs.readdir(path.join(log_root_dir,year.toString()),function  (err,files) {
		if (err) {
			this.plain('error year');
			return;
		};
		self.layout('layout');
		self.view('months',{year: year, months:files });
	})
}
function  view_allDaysForYearAndMonth (year,month) {
	var self = this;
	var month_dir = path.join(log_root_dir,year.toString(),month.toString());
	fs.readdir(month_dir,function  (err,files) {
		if (err) {
			self.plain('error month');
			return;
		};
		var days = [];
		for (var i = 0; i < files.length; i++) {
			 days.push(path.basename(files[i],'.json'));
		};
		self.layout('layout');
		self.view('days',{year: year, month: month, days: days});
	})
}
function getDayLogs (year,month,day,cb) {
	var day_log_file = path.join(log_root_dir,year.toString(),month.toString(),day.toString());
	day_log_file += '.json';
	fs.readFile(day_log_file,"utf8",function  (err,data) {
		cb(err,data);
	});
}
function  viewDayLogs (year,month,day) {
	var self = this;
	getDayLogs(year,month,day,function  (err,data) {
		if (err) {
			self.plain('err log_file');
		}
		else
		{
			self.layout('layout_log');
			var jData = JSON.parse(data);
			// for (var i = 0; i < jData.length; i++) {
			// 	var timeReg = new RegExp("[0-9][0-9]:[0-9][0-9]:[0-9][0-9]");
			// 	jData[i].date = timeReg.exec(jData[i].date)[0];
			// };
			self.view('day_log',{year: year, month: month, day: day,log_data: jData});
		}
	});
}

function view_days () {
	var self = this;
	var date = new Date(self.query.date);
	getDayLogs(date.getFullYear().toString(),date.getMonth().toString(),date.getDate().toString(),function  (err,data) {
		if (err) {
			self.callback()({datas:[],display: cfg.log_dis});
		} else{
			var jData = JSON.parse(data);
			self.callback()({datas:jData,display: cfg.log_dis});
		};

	});
	
}


function mkdir_rec (dir) {
	var parent_dir = path.dirname(dir);
	if (parent_dir && !fs.existsSync(parent_dir)) {
		mkdir_rec(parent_dir);
	};
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir,0744);
	};
	
}

if(!fs.existsSync(log_root_dir))
{
	mkdir_rec(log_root_dir);
}
function err_log () {
	var self = this;
	var model = self.body;
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
	self.json(contents);
}

