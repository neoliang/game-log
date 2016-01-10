var fs = require('fs')
fs.readdir("/tmp",function(err,files){
	console.log(files);
});