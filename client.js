requirejs.config({
	baseUrl: 'lib'
});

var Chuck;
requirejs(["Chuck/Chuck"], function(c) {
	Chuck = c;
	setupSocket();
});

function setupSocket(){
	var socket = io.connect(location.href);

	socket.on('connect', onConnect);
	socket.on('message', onMessage);
	socket.on('disconnect',onDisconnect);
}

function onConnect () {
	console.log('Client connected');
	Chuck.init();
}

function onMessage (packet) {
	packet = JSON.parse(packet);
		
	if (packet && packet.m) {
		processServerCommand(packet);
	}
}

function onDisconnect () {
	console.log('client disconnected');
}

function processServerCommand(packet){
	switch(packet.m) {
		case 'join':
			break;

		case 'nick':
			break;

		case 'gameCommand':
			Chuck.processGameCommand(packet.d);
			break;

		default:	
			break;
	}
}