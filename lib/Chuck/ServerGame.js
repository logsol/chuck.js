define(["Chuck/Processors/ServerProcessor"], function(ServerProcessor) {
	
	function ServerGame(channel) {
		this.channel = channel;
		this.serverProcessor = new ServerProcessor(this);
	}

	ServerGame.prototype.loadLevel = function(path) {
		this.serverProcessor.loadLevel(path);
	}

	ServerGame.prototype.progressGameCommandFromUser = function(command, options, user) {
		this.serverProcessor.progressGameCommandFromId(command, options, user.id);
	}

	ServerGame.prototype.destruct = function() {
		this.serverProcessor.destruct();
	}

	ServerGame.prototype.createPlayerForUser = function(user) {
		this.serverProcessor.createPlayerWithId(user.id);
	}

	ServerGame.prototype.updateClientsWorld = function(update_world) {
		this.channel.sendCommandToAllUsers('gameCommand', {worldUpdate: update_world});
	}

	return ServerGame;
});