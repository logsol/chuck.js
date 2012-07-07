define(['socket.io'], function(io) {

	function Socket(server, coordinator) {
		this.coordinator = coordinator;
		this.socket = io.listen(server);

		this.init(server);
	}

	Socket.prototype.init = function(){

		var self = this;

		this.socket.configure('development', function(){
			this.set('log level', 0);
		});

		this.socket.on('connection', function(user){
			self.onConnection(user);
		});
	}

	Socket.prototype.onConnection = function(socketLink){
		this.coordinator.createUser(socketLink);
	}

	return Socket;
	
});