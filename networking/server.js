var http = require('http'),
	 io = require('socket.io'), 
	 fs = require('fs'),
	 Box2D = require('./box2d.js');

eval(fs.readFileSync('common.js') + '');

var clients = [];

function update() {
	world.Step(1 / 60, 10, 10);
	world.ClearForces();
}

setInterval(update, 1000 / 60);
setInterval(updateClients, 100);

function updateClients() {
	var body = world.GetBodyList();
	var update = {};
	var isUpdateNeeded = false;
	
	do {
		var userData = body.GetUserData();

		if(userData && userData.bodyId && body.IsAwake()){
			update[userData.bodyId] = {
				p: body.GetPosition(),
				a: body.GetAngle(),
				v: body.GetLinearVelocity(),
			};
			isUpdateNeeded = true;
		}
	} while (body = body.GetNext());
	
	
	if(isUpdateNeeded) { 
		sendToClients('world-update', update);
	}
}

function sendToClients(message, data) {
	var packet = {
		m: message,
		d: data
	}
	//console.log(JSON.stringify(packet));
	for (var i = 0; i < clients.length; i++) {
		clients[i].send(JSON.stringify(packet));
	}
}

function pong(client, data) {
	var packet = {
		m: 'pong',
		d: data
	}
	client.send(JSON.stringify(packet));
}

setupWorld();
//update();

// SOCKETS

var server = http.createServer(
	function(req, res){
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		res.end('<h1>Hello world</h1>'); 
	}
);


server.listen(xport, xhost);
console.log('port', xport);
var socket = io.listen(server);

socket.configure('development', function(){
	socket.set('log level', 0);
});

socket.on('connection', function(client) {
	clients.push(client);
	console.log("Total clients: " + clients.length);
	
	client.send(JSON.stringify({"startId" : clients.length}));

	client.on('message', function(packet){
		packet = JSON.parse(packet);
		
		if(packet && packet.m){
			switch(packet.m){
				case 'jump':
					jump();
					break;
				case 'ping':
					pong(client, packet.d);
					break;
				default:
					break;
			}
		}
		updateClients();
	});

	client.on('disconnect', function(){
		console.log("disconnect");		
	}); 
});

/******* collision ********/

function createCollisionDetector() {
	var listener = new b2ContactListener();
   
	listener.BeginContact = function(contact){
		contact.GetFixtureA()
		contact.GetFixtureB()
		
		
	}
	listener.PostSolve = function(contact, impulse){
    	
	}
	listener.EndContact = function(contact){
    	
	}
    
	return listener;
}






