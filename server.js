var http = require('http'),
	io = require('socket.io'),
	nodeStatic = require('node-static')
	requirejs = require('requirejs');

requirejs.config({
	nodeRequire: require,
	baseUrl: 'lib'
});


var chuck;
requirejs(["Chuck/Chuck"], function(Chuck) {
	Chuck.init();
});

var clients = [];

// Setting up http server
var fileServer = new nodeStatic.Server('./', { cache: false });

function handleFileError(res){
	res.writeHead(404, {'Content-Type': 'text/html'}); 
	res.end('<h1>404 not ... found</h1>'); 
}

var server = http.createServer(
	function(req, res){
		req.addListener('end', function () {
			switch(true) {
				case req.url == '/':
					fileServer.serveFile('./static/html/index.html', 200, {}, req, res);
					break;

				case req.url == '/client.js':
					fileServer.serveFile('./client.js', 200, {}, req, res);
					break;

				case req.url == '/require.js':
					fileServer.serveFile('./node_modules/requirejs/require.js', 200, {}, req, res);
					break;

				case new RegExp(/^\/lib/).test(req.url):
					fileServer.serve(req, res, function(){
						handleFileError(res)
					});
					break;

				case new RegExp(/^\/static/).test(req.url):
					fileServer.serve(req, res, function(){
						handleFileError(res)
					});
					break;

				default:
					handleFileError(res);
					break;
			}
		});
	}
);
server.listen(1234);

var socket = io.listen(server);

socket.configure('development', function(){
	socket.set('log level', 0);
});

socket.on('connection', function(client) {
	console.log('client connected');
	clients.push(client);
	console.log("Total clients: " + clients.length);
	
	client.send(JSON.stringify({"startId" : clients.length}));

	client.on('message', function(packet){
		packet = JSON.parse(packet);
		
		if(packet && packet.m){
			switch(packet.m){
				case 'jump':
					jump();
					updateWorld(client);
					break;
				case 'ping':
					pong(client, packet.d);
					break;
				default:
					break;
			}
		}
		//updateWorld();
	});

	client.on('disconnect', function(){
		console.log("disconnect");		
	}); 
});