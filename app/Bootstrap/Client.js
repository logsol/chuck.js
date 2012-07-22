define([
	"Game/Client/Networker", 
	"Lib/Vendor/SocketIO"
],

function(Networker, SocketIO) {

	function Client(location) {
		this.socket = SocketIO.connect(location);
		this.networker = new Networker(socket);
	}

	return Client;
	
});