


var fs = require('fs');
var path = require('path');
var log_root_dir = '/tmp';
var cfg = {};
var hash_file = 'hash_file.json';
var hash_datas = {};
var save_hash_interval = 30 * 60 * 1000; //10 分钟保存一次

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
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

var getHashCodeFromContents =function(jData){
  var hashs = {};
  for (var i = 0; i < jData.length; i++) {
    var content = jData[i].content;
    Object.keys(content).forEach(function  (key) {
      var v = cfg.log_dis[key];
      if (typeof(v) === 'object' && v.type === 'hash') {
        hashs[content[key].toString()] = true;
      }
    });
  };
  return hashs;
};

var getDayLogs = function  (year,month,day,cb) {
  var day_log_file = path.join(log_root_dir,year.toString(),month.toString(),day.toString());
  var day_hash_file_name = day_log_file + 'hash.json';
  day_log_file += '.json';
  fs.readFile(day_log_file,"utf8",function  (err,data) {
    if (err) {
      cb(err,data);
    }
    else
    {
      var jData = JSON.parse(data);
      fs.readFile(day_hash_file_name,'utf8',function  (err,dataHash) {
        var day_hash_data = {};
        if(err){
          day_hash_data = getHashCodeFromContents(jData);
        }
        else
        {
          day_hash_data = JSON.parse(dataHash);
        }
        Object.keys(day_hash_data).forEach(function(key){
          day_hash_data[key] = hash_datas[key];
        });
        cb(null,jData,day_hash_data);
      })
    }
  });
};



var view_day_event = function  (req,res) {
  var date = new Date(req.query.date);
  getDayLogs(date.getFullYear().toString(),date.getMonth().toString(),date.getDate().toString(),function  (err,jData,day_hash_datas) {
    if (err) {
      res.json({datas:[],display: cfg.log_dis});
    } 
    else
    {
      res.json({
        datas:jData,
        display:cfg.log_dis,
        hash_data:day_hash_datas
      });
    }
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
  var day_hash_datas = {};
  var day_hash_file_name = path.join(current_log_dir,day+'hash.json');
  if (fs.existsSync(day_hash_file_name)) {
    day_hash_datas = JSON.parse(fs.readFileSync(day_hash_file_name));
  };
  var transModel = {}
  Object.keys(model).forEach(function  (key) {
    var v = cfg.log_dis[key];
    if (typeof(v) === 'object' && v.type === 'hash') {
      var code = model[key].toString().hashCode();
      transModel[key] = code;
      hash_datas[code] = model[key].toString();
      day_hash_datas[code] = true;
    }
    else
    {
      transModel[key] = model[key].toString();
    }
  });
  var content = {
    "date":now.toString(),
    "content":transModel,
  };
  contents.push(content);
  fs.writeFileSync(log_file,JSON.stringify(contents));
  fs.writeFileSync(day_hash_file_name,JSON.stringify(day_hash_datas));
  res.end();
};

var init = function(app){
  cfg = app.get('cfg');
  log_root_dir = app.get('cfg').log_root_dir;
  hash_file = path.join(log_root_dir,hash_file);
  if(!fs.existsSync(log_root_dir))
  {
    mkdir_rec(log_root_dir);
  }

  if (fs.existsSync(hash_file)) {
    hash_datas = JSON.parse(fs.readFileSync(hash_file));
  }

  var saveRootHashFile = function () {
    fs.writeFileSync(hash_file,JSON.stringify(hash_datas));
  }

  setTimeout(saveRootHashFile,save_hash_interval);
  
  //catches ctrl+c event
  process.on('SIGINT', function(){
    saveRootHashFile();
    process.exit(1);
  });
  //catches uncaught exceptions
  process.on('uncaughtException', saveRootHashFile);
};

module.exports = function(app){ 
  init(app);
  return{
    view_day_event: view_day_event,
    post_event: post_event,
  };
}
