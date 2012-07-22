define([
	"Game/Core/Protocol/Helper"
	"Game/Server/NotificationCenter"
], 

function(ProtocolHelper, NotificationCenter) {

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

	User.prototype.setChannel = function(channel) {
		if (NotificationCenter) {
			NotificationCenter.off("updateClientsWorld");			
		}

		this.channel = channel;

		// Use the right factory and nc
		NotificationCenter = this.channel.notificationCenter;
		this.factory = this.channel.factory;

		var self = this;
		NotificationCenter.on("sendCommandToAllUsers", function(topic, args) {
			self.sendCommand.apply(self, args);
		});
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
				for(var gameCommand in options) {
					NotificationCenter.trigger("processGameCommandFromUser", [gameCommand, options[gameCommand], this]);
					//this.channel.processGameCommandFromUser(gameCommand, options[gameCommand], this);
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