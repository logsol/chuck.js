define(["Chuck/Processors/ClientProcessor"], function(ClientProcessor) {
	
	function ClientGame(networker, id) {
		this.networker = networker;
		this.processor = new ClientProcessor(this);
		this.processor.spawnMeWithId(id);
	}

	ClientGame.prototype.loadLevel = function(path) {
		this.processor.loadLevel(path);
	}

	ClientGame.prototype.userJoined = function(userId) {
		this.processor.spawnNewPlayerWithId(userId);
	};

	ClientGame.prototype.processGameCommand = function(command, options){
		this.processor.processGameCommand(command, options);
	}

	ClientGame.prototype.sendGameCommand = function(command, options) {
		this.networker.sendGameCommand(command, options);	
	}

	ClientGame.prototype.destruct = function(){
		this.processor.destruct();
	}

	return ClientGame;
});