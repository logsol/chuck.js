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

function onMessage (message) {
	var commands = JSON.parse(message);
		
	for(var command in commands) {
		processControlCommand(type, command[type]);
	}
}

function onDisconnect () {
	console.log('client disconnected');
}

function processControlCommand(command, options){
	switch(command) {
		case 'joined':
			break;

		case 'nick':
			break;

		case 'gameCommand':
			Chuck.processGameCommand(options);
			break;

		default:	
			break;
	}
}