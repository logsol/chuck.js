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

requirejs(requirements, function(HttpServer, Socket, Coordinator) {
	
	var options = {
		port: 1234, 
		rootDirectory: './',
		caching: false
	};

	var coordinator = new Coordinator();
	var httpServer = new HttpServer(options);
	var socket = new Socket(httpServer.getServer(), coordinator);

	inspector.coordinator = coordinator;
});

exports = module.exports = inspector;

/*
belongs to channel.js
var chuck;
requirejs(["Chuck/Chuck"], function(Chuck) {
	Chuck.init();
	chuck = Chuck;
});
*/