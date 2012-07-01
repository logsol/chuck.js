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


// Setting up http server
var fileServer = new nodeStatic.Server('./', { cache: false });

var server = http.createServer(
	function(req, res){
		req.addListener('end', function () {
			switch(req.url) {
				case '/':
					fileServer.serveFile('./index.html', 200, {}, req, res);
					break;

				case '/client.js':
					fileServer.serveFile('./client.js', 200, {}, req, res);
					break;

				case '/require.js':
					fileServer.serveFile('./node_modules/requirejs/require.js', 200, {}, req, res);
					break;

				default:
					if(req.url.match(/^\/lib/)) {
						fileServer.serve(req, res);
					} else {
						res.writeHead(404, {'Content-Type': 'text/html'}); 
						res.end('<h1>404 not ... found</h1>'); 
					}
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

socket.on('connection', function(client) {/*
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
	}); */
});