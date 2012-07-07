define(["Protocol/Parser"], function(Parser) {

	function User(socketLink, coordinator) {

		this.id = socketLink.id;
		this.socketLink = socketLink;
		this.coordinator = coordinator;
		this.channel = null;
		
		this.init(socketLink);
	}

	User.prototype.init = function(socketLink){

		socketLink.on('message', function(message){
			this.onMessage(message);
		});

		socketLink.on('disconnect', function(){
			this.onDisconnect();
		});
	}

	User.prototype.setChannel = function(channel){
		this.channel = channel;
	}

	User.prototype.send = function(message){
		message = Parser.encode(message);
		this.socketLink.send(message);
	}

	User.prototype.onMessage = function(){
		var commands = Parser.decode(message);
		for(var command in commands) {
			this.processControlCommand(command, commands[command]);
		}
	}

	User.prototype.onDisconnect = function(){
		return null;
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
				//this.channel.game.processGameCommand(options);
				break;

			default: 
				break;
		}
	}

	return User;
	
});