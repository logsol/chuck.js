define(["Chuck/Processors/ClientProcessor"], function(ClientProcessor) {
	
	function ClientGame(networker, id) {
		this.networker = networker;
		this.clientProcessor = new ClientProcessor(this);
		this.clientProcessor.spawnMeWithId(id);

		this.players = {};
	}

	ClientGame.prototype.loadLevel = function(path) {
		this.clientProcessor.loadLevel(path);
	}

	ClientGame.prototype.userJoined = function(userId) {
		this.players[userId] = this.clientProcessor.spawnNewPlayerWithId(userId);
	}

	ClientGame.prototype.userLeft = function(userId) {
		var player = this.players[userId];
		player.destroy();
		delete this.players[userId];
	}

	ClientGame.prototype.processGameCommand = function(command, options){
		this.clientProcessor.processGameCommand(command, options);
	}

	ClientGame.prototype.sendGameCommand = function(command, options) {
		this.networker.sendGameCommand(command, options);	
	}

	ClientGame.prototype.destruct = function(){
		this.clientProcessor.destruct();
	}

	return ClientGame;
});