requirejs.config({
	baseUrl: 'lib'
});

var inspector = {};

requirejs(["Client/Networker", "socket.io/socket.io.js"], function(Networker) {
	var socket = io.connect(location.href);
	var networker = new Networker(socket);

	inspector.networker = networker;
});