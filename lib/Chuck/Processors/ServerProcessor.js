var requires = [
	"Chuck/Physics/Engine", 
	"Chuck/Player", 
	"Vendor/Box2D",
	"Chuck/Loader/Level",
	"RequestAnimationFrame"
];

define(requires, function(PhysicsEngine, Player, Box2D, Level, requestAnimFrame){

	function ServerGame () {
		this.init();
	};

	ServerGame.prototype.init = function() {
	    this.physicsEngine = new PhysicsEngine();
  	    
	    this.update();
	}

	ServerGame.prototype.loadLevel = function(path) {
		if (this.level) {
			this.level.unload();
		}

		this.level = new Level(path, this.physicsEngine);
		this.level.loadLevelInToEngine();

		console.log(this.level);
	}

	ServerGame.prototype.getPhysicsEngine = function() {
	    return this.physicsEngine;
	}

	ServerGame.prototype.update  = function() {
		requestAnimFrame(this.update.bind(this));
	    this.physicsEngine.update();
	}

	ServerGame.prototype.destruct = function() {
		
	}

	return ServerGame;
});
