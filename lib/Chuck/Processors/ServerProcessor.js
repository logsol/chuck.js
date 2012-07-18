var requires = [
	"Chuck/Physics/Engine", 
	"Chuck/Player", 
	"Chuck/Settings", 
	"Vendor/Box2D",
	"Chuck/Loader/Level",
	"Chuck/Control/InputController",
	"RequestAnimationFrame"
];

define(requires, function(PhysicsEngine, Settings, Player, Box2D, Level, InputController, requestAnimFrame){

	function ServerProcessor (serverGame) {
		this.serverGame = serverGame;
		this.players = {};
		this.init();
	};

	ServerProcessor.prototype.init = function() {
	    this.physicsEngine = new PhysicsEngine();
  	    
	    this.update();
	    this.updateWorld();
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
	    	this.players[id].player.update();
	    }
	}

	ServerProcessor.prototype.destruct = function() {
		
	}

	ServerProcessor.prototype.createPlayerWithId = function(id) {
		var player = new Player(this.physicsEngine, id, null);
		this.players[id] = {
			player: player,
			inputController: new InputController(player)
		};

		player.spawn(100, 0);
  	    this.physicsEngine.setCollisionDetector(player);
	}

	ServerProcessor.prototype.progressGameCommandFromId = function(command, options, id) {
		var inputController = this.players[id].inputController;
		if (typeof inputController[command] == 'function') {
			inputController[command](options);
		}
	}

	ServerProcessor.prototype.userIdLeft = function(id) {
		var player = this.players[id].player;
		player.destroy();
		delete this.players[id];
	}

	ServerProcessor.prototype.updateWorld = function() {
		
		var update = {};
		var isUpdateNeeded = false;

		var body = this.physicsEngine.world.GetBodyList();
		do {
			var userData = body.GetUserData();

			if(userData && body.IsAwake()){
				update[userData] = {
					p: body.GetPosition(),
					a: body.GetAngle(),
					lv: body.GetLinearVelocity(),
					av: body.GetAngularVelocity()
				};
				isUpdateNeeded = true;
			}
		} while (body = body.GetNext());
		
		if(isUpdateNeeded) { 
			this.serverGame.updateClientsWorld(update);
		}

		setTimeout(this.updateWorld.bind(this), Settings.WORLD_UPDATE_BROADCAST_INTERVAL);
	}

	return ServerProcessor;
});
