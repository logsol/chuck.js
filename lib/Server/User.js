define(["Protocol/Helper"], function(ProtocolHelper) {

	function User(socketLink, coordinator) {

		this.id = socketLink.id;
		this.socketLink = socketLink;
		this.coordinator = coordinator;
		this.channel = null;
		
		this.init(socketLink);
	}

	User.prototype.init = function(socketLink){

		var self = this;

		socketLink.on('message', function(message){
			self.onMessage(message);
		});

		socketLink.on('disconnect', function(){
			self.onDisconnect();
		});
	}

	User.prototype.setChannel = function(channel){
		this.channel = channel;
	}

	User.prototype.sendCommand = function(command, options) {
		var message = ProtocolHelper.encodeCommand(command, options);
		this.socketLink.send(message);
	}

	User.prototype.onMessage = function(message){
		var self = this;
		ProtocolHelper.runCommands(message, function(command, options){
			self.processControlCommand(command, options);
		});
	}

	User.prototype.onDisconnect = function(){
		this.coordinator.removeUser(this);
	}

	User.prototype.processControlCommand = function(command, options){
		switch(command) {

			case 'join':
				this.coordinator.assignUserToChannel(this, options);
				break;

			case 'leave':
				this.coordinator.assignUserToLobby(this);
				break;

			case 'gameCommand':
				for(var c in options) {
					this.channel.processGameCommandFromUser(c, options[c], this);
				}
				break;

			default: 
				break;
		}
	}

	User.prototype.toString = function() {
		return "[User " + this.id + "]";
	};

	return User;
	
});