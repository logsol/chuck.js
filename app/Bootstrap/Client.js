define([
	"Game/Client/Networker", 
	"Lib/Vendor/SocketIO"
],

function(Networker, SocketIO) {

	function Client(location, options) {
		this.socket = SocketIO.connect(location, options);
		this.networker = new Networker(this.socket);
	}

	return Client;
	
});