define(["Chuck/Processors/ClientProcessor"], function(ClientProcessor) {
	
	function ClientGame(networker, id) {
		this.networker = networker;
		this.processor = new ClientProcessor();
		this.processor.spawnMeWithId(id);
	}

	ClientGame.prototype.loadLevel = function(path) {
		this.processor.loadLevel(path);
	}

	ClientGame.prototype.userJoined = function(userId) {
		this.processor.spawnNewPlayerWithId(userId);
	};

	ClientGame.prototype.processGameCommand = function(command, options){
		console.log('(not implemented) processGameCommand:', command, options);
	}

	ClientGame.prototype.destruct = function(){
		this.processor.destruct();
	}

	return ClientGame;
});