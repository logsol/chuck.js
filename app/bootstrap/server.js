var requirejs = require('requirejs');

var inspector = {};

requirejs.config({
	nodeRequire: require,
	baseUrl: 'lib'
});

var requirements = [
	"Server/HttpServer", 
	"Server/Socket",
	"Server/Coordinator"
];	

var port = process.argv[2] 
	|| process.env.PORT 
	|| process.env.npm_package_config_port;

requirejs(requirements, function(HttpServer, Socket, Coordinator) {
	
	var options = {
		port: port, 
		rootDirectory: './',
		caching: false,
		logLevel: process.argv[3]
	};

	var coordinator = new Coordinator();
	var httpServer = new HttpServer(options);
	var socket = new Socket(httpServer.getServer(), options, coordinator);

	inspector.coordinator = coordinator;
});

exports = module.exports = inspector;
