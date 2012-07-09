define(["Chuck/Processor"], function(Processor){
	
	function Game(networker){
		this.networker = networker;
		this.processor = new Processor();
		this.processor.loadLevel("default.json");
	}

	Game.prototype.processGameCommand = function(command, options){
		console.log('(not implemented) processGameCommand:', command, options);
	}

	Game.prototype.destruct = function(){
		this.processor.destruct();
	}

	return Game;
});