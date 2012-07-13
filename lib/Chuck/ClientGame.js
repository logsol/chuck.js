define(["Chuck/Processors/ClientProcessor"], function(ClientProcessor) {
	
	function ClientGame(networker){
		this.networker = networker;
		this.processor = new ClientProcessor();
	}

	ClientGame.prototype.loadLevel = function(path) {
		this.processor.loadLevel(path);
	}

	ClientGame.prototype.processGameCommand = function(command, options){
		console.log('(not implemented) processGameCommand:', command, options);
	}

	ClientGame.prototype.destruct = function(){
		this.processor.destruct();
	}

	return ClientGame;
});