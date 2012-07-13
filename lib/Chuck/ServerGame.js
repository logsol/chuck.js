define(["Chuck/Processors/ServerProcessor"], function(ServerProcessor) {
	
	function ServerGame(channel) {
		this.channel = channel;
		this.serverProcessor = new ServerProcessor(this);
	}

	ServerGame.prototype.loadLevel = function(path) {
		this.serverProcessor.loadLevel(path);
	}

	ServerGame.prototype.processGameCommand = function(command, options) {
		console.log('(not implemented) processGameCommand:', command, options);
	}

	ServerGame.prototype.destruct = function() {
		this.serverProcessor.destruct();
	}

	ServerGame.prototype.createPlayerForUser = function(user) {
		this.serverProcessor.createPlayerWithId(user.id);
	}

	ServerGame.prototype.updateClientsWorld = function(update_world) {
		this.channel.sendCommandToAllUsers('gameCommand', update_world);
	}

	return ServerGame;
});