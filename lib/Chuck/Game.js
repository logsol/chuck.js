define(["Chuck/Settings", "Chuck/Processors/ServerProcessor", "Chuck/Processors/ClientProcessor"], function(Settings, ServerProcessor, ClientProcessor){
	
	function Game(networker){
		this.networker = networker;
		this.processor = this.createProcessor();

		this.processor.loadLevel("default.json");
	}

	Game.prototype.createProcessor = function(){
		var processor;

		if(Settings.IS_BROWSER_ENVIRONMENT){
			processor = new ClientProcessor();
		} else {
			processor = new ServerProcessor();
		}
		return processor;
	}

	Game.prototype.processGameCommand = function(command, options){
		console.log('(not implemented) processGameCommand:', command, options);
	}

	Game.prototype.destruct = function(){
		this.processor.destruct();
	}

	return Game;
});