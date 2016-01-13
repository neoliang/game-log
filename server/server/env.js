var path = require('path'),
	rootPath = path.normalize(__dirname + './../');
	
module.exports = {
	development: {
		rootPath: rootPath,
		cfg: path.join(rootPath,"config.json"),
		port: process.env.PORT || 8080
	},
	production: {
		rootPath: rootPath,
		cfg: path.join(rootPath,"config.json"),
		port: process.env.PORT || 8080
	}
};