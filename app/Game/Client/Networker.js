define(["Game/Core/Protocol/Helper", "Game/Client/GameController"], function(ProtocolHelper, GameController) {

	function Networker(socketLink) {
		this.socketLink = socketLink;
		this.GameController = null;

		this.init();
	}

	Networker.prototype.init = function() {
		
		var self = this;

		this.socketLink.on('connect', function() {
			self.onConnect();
		});

		this.socketLink.on('message', function(message) {
			self.onMessage(message);
		});

		this.socketLink.on('disconnect', function() {
			self.onDisconnect();
		});
	}

	Networker.prototype.onConnect = function() {
		this.join('dungeon');
	}

	Networker.prototype.onMessage = function(message) {
		var self = this;
		ProtocolHelper.runCommands(message, function(command, options) {
			self.processControlCommand(command, options);
		});
	}

	Networker.prototype.onDisconnect = function() {
		this.GameController.destruct();
		this.GameController = null;
	}

	Networker.prototype.join = function(channelName){
		this.sendCommand('join', channelName);
	}

	Networker.prototype.sendCommand = function(command, options) {
		var message = ProtocolHelper.encodeCommand(command, options);
		this.socketLink.send(message);
	}

	Networker.prototype.onJoinSuccess = function(options) {
		this.GameController = new GameController(this, options.id);
		this.GameController.loadLevel("default.json")
		console.log("Joined " + options.channelName);

		if (options.userIds && options.userIds.length > 0) {
			for(var i = 0; i < options.userIds.length; i++) {
				this.GameController.userJoined(options.userIds[i])
			}
		}
	}

	Networker.prototype.onUserJoined = function(userId) {
		this.GameController.userJoined(userId);
		console.log("User " + userId + " joined");
	}

	Networker.prototype.sendGameCommand = function(command, options) {
		this.sendCommand('gameCommand', ProtocolHelper.assemble(command, options));
	}

	Networker.prototype.onUserLeft = function(userId) {
		this.GameController.userLeft(userId);
	}

	Networker.prototype.processControlCommand = function(command, options) {
		switch(command) {
			case 'joinSuccess':
				this.onJoinSuccess(options);
				break;

			case 'gameCommand':
				for(var gameCommand in options) {
					this.GameController.processGameCommand(gameCommand, options[gameCommand]);
				}
				break;

			case 'userJoined':
				this.onUserJoined(options);
				break;

			case 'userLeft':
				this.onUserLeft(options);
				break;

			default:	
				break;
		}
	}

	return Networker;
	
});