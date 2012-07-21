var requirejs = require('requirejs');

var inspector = {};

requirejs.config({
	nodeRequire: require,
	baseUrl: 'app'
});

var port = process.argv[2] 
	|| process.env.PORT 
	|| process.env.npm_package_config_port;

var options = {
	port: port, 
	rootDirectory: './',
	caching: false,
	logLevel: process.argv[3] || 0
};

requirejs(["Bootstrap/Server"], function(Server) {
	var server = new Server(options);
	inspector.server = server;
});

exports = module.exports = inspector;