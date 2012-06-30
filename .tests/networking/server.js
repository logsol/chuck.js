var http = require('http'),
	 io = require('socket.io'), 
	 fs = require('fs'),
	 Box2D = require('./box2d.js');

eval(fs.readFileSync('common.js') + '');

var clients = [];
var lastIntervalTime = new Date().getTime();

function update() {
	var newTime = new Date().getTime()
	//console.log(newTime - lastIntervalTime);
	lastIntervalTime = newTime;
	
	world.Step(1 / 60, 10, 10);
	world.ClearForces();
}

function updateWorld(client) {
	
	var body = world.GetBodyList();
	var update = {};
	var isUpdateNeeded = false;
	
	do {
		var userData = body.GetUserData();

		if(userData && userData.bodyId && body.IsAwake()){
			update[userData.bodyId] = {
				p: body.GetPosition(),
				a: body.GetAngle(),
				lv: body.GetLinearVelocity(),
				av: body.GetAngularVelocity()
			};
			isUpdateNeeded = true;
		}
	} while (body = body.GetNext());
	
	
	if(isUpdateNeeded) { 
		sendToClients('world-update', update, null);
	}
}

function updateWithBodies(bodies) {
	
	var update = {};
	var isUpdateNeeded = false;
	
	for(var b in bodies) {
		var body = bodies[b];
		
		//console.log(body);		
		
		var userData = body.GetUserData();

		if(userData && userData.bodyId && body.IsAwake()){
			update[userData.bodyId] = {
				p: body.GetPosition(),
				a: body.GetAngle(),
				lv: body.GetLinearVelocity(),
				av: body.GetAngularVelocity()
			};
			isUpdateNeeded = true;
		}
	}
	
	
	if(isUpdateNeeded) { 
		sendToClients('world-update', update);
	}
}

function sendToClients(message, data, except) {
	var packet = {
		m: message,
		d: data
	}
	for (var i = 0; i < clients.length; i++) {
		if(clients[i] != except) {
			clients[i].send(JSON.stringify(packet));
		}
	}
}

function pong(client, data) {
	var packet = {
		m: 'pong',
		d: data
	}
	client.send(JSON.stringify(packet));
}

// Set Gravity here
setupWorld(0);
//world.SetContactListener(createCollisionDetector());

// Box2D Engine step configuration
setInterval(update, 1000 / 60);

// Send world update to client every 32 ms
setInterval(updateWorld, 32);


// Setting up socket
var server = http.createServer(
	function(req, res){
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		res.end('<h1>Box2D Network Testing</h1>'); 
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

// The approach here was to only send updates when collisions happen
/*
function createCollisionDetector() {
	var listener = new b2ContactListener();
   
	listener.BeginContact = function(contact){
		
	}
	listener.PostSolve = function(contact, impulse){
    	
	}
	listener.EndContact = function(contact){
    		updateWithBodies([contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody()]);
	}
    
	return listener;
}
*/
