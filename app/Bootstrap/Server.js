define([
	"Server/HttpServer", 
	"Server/Socket",
	"Server/Coordinator"
],

function(HttpServer, Socket, Coordinator) {

	function Server(options) {
		this.coordinator = new Coordinator();
		this.httpServer = new HttpServer(options);
		this.socket = new Socket(httpServer.getServer(), options, coordinator);
	}

	return Server;
});