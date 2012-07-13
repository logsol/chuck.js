var requires = [
	"Chuck/Physics/Engine", 
	"Chuck/Player", 
	"Vendor/Box2D",
	"Chuck/Loader/Level",
	"RequestAnimationFrame"
];

define(requires, function(PhysicsEngine, Player, Box2D, Level, requestAnimFrame){

	function ServerProcessor (ServerProcessor) {
		this.ServerProcessor = ServerProcessor;
		this.players = {};
		this.init();
	};

	ServerProcessor.prototype.init = function() {
	    this.physicsEngine = new PhysicsEngine();
  	    
	    this.update();
	}

	ServerProcessor.prototype.loadLevel = function(path) {
		if (this.level) {
			this.level.unload();
		}

		this.level = new Level(path, this.physicsEngine);
		this.level.loadLevelInToEngine();
	}

	ServerProcessor.prototype.getPhysicsEngine = function() {
	    return this.physicsEngine;
	}

	ServerProcessor.prototype.update  = function() {

		requestAnimFrame(this.update.bind(this));

	    this.physicsEngine.update();
	    for(var id in this.players) {
	    	this.players[id].update();
	    }
	}

	ServerProcessor.prototype.destruct = function() {
		
	}

	ServerProcessor.prototype.createPlayerWithId = function(id) {
		var player = new Player(this.physicsEngine, id, null);
		this.players[id] = player;

		player.spawn(100, 0);
  	    this.physicsEngine.setCollisionDetector(player);
	}

	ServerProcessor.prototype.updateWorld = function() {
		
		var update = {};
		var isUpdateNeeded = false;

		var body = world.GetBodyList();
		do {
			var userData = body.GetUserData();

			if(userData && userData.bodyId && body.IsAwake()){
				update[userData.bodyId] = {
					p: body.GetPosition(),
					a: body.GetAngle(),
					lv: body.GetLinearVelocity(),
					av: body.GetAngularVelocity()
				};
				isUpdateNeeded = true;
			}
		} while (body = body.GetNext());
		
		if(isUpdateNeeded) { 
			this.ServerProcessor.updateClientsWorld(update);
		}
	}

	return ServerProcessor;
});
