requirejs.config({
	baseUrl: 'lib'
});

var inspector = {};

requirejs(["Client/Networker", "SocketIO"], function(Networker, SocketIO) {
	var socket = SocketIO.connect(location.href);
	var networker = new Networker(socket);

	inspector.networker = networker;
});