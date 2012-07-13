define(["Chuck/Processors/ServerProcessor"], function(ServerProcessor) {
	
	function ServerGame(chanel) {
		this.chanel = chanel;
		this.processor = new ServerProcessor();
	}

	ServerGame.prototype.loadLevel = function(path) {
		this.processor.loadLevel(path);
	}

	ServerGame.prototype.processGameCommand = function(command, options) {
		console.log('(not implemented) processGameCommand:', command, options);
	}

	ServerGame.prototype.destruct = function() {
		this.processor.destruct();
	}

	return ServerGame;
});