requirejs.config({
	baseUrl: 'lib'
});

var inspector = {};

requirejs(["Client/Networker"], function(Networker) {
	var socket = io.connect(location.href);
	var networker = new Networker(socket);

	inspector.networker = networker;
});