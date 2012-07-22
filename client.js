requirejs.config({
	baseUrl: 'app'
});

var inspector = {};

requirejs(["Bootstrap/Client"], function(Client) {
	
	var client = new Client(location.href);
	inspector.client = client;
});