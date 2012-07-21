define([
	"Chuck/Physics/Engine", 
	"Chuck/Settings", 
	"Chuck/Player", 
	"Vendor/Box2D",
	"Chuck/Loader/Level",
	"Chuck/Control/InputController",
	"RequestAnimationFrame"
],

function(PhysicsEngine, Settings, Player, Box2D, Level, InputController, requestAnimFrame) {

	function GameController (channel) {
		this.channel = channel;
		this.players = {};
		this.init();
	}

	GameController.prototype.init = function() {
	    this.physicsEngine = this.factory.new(PhysicsEngine);
  	    
	    this.update();
	    this.updateWorld();
	}

	GameController.prototype.loadLevel = function(path) {
		if (this.level) {
			this.level.unload();
		}

		this.level = new Level(path, this.physicsEngine);
		this.level.loadLevelInToEngine();
	}

	GameController.prototype.getPhysicsEngine = function() {
	    return this.physicsEngine;
	}

	GameController.prototype.update  = function() {

		requestAnimFrame(this.update.bind(this));

	    this.physicsEngine.update();
	    for(var id in this.players) {
	    	this.players[id].player.update();
	    }
	}

	GameController.prototype.destruct = function() {
		
	}

	GameController.prototype.createPlayerForUser = function(user) {
		var id = user.id;
	
		var player = new Player(this.physicsEngine, id, null);
		this.players[id] = {
			player: player,
			inputController: new InputController(player)
		};

		player.spawn(100, 0);
  	    this.physicsEngine.setCollisionDetector(player);
	}

	GameController.prototype.progressGameCommandFromId = function(command, options, id) {
		var inputController = this.players[id].inputController;
		if (typeof inputController[command] == 'function') {
			inputController[command](options);
		}
	}

	GameController.prototype.userIdLeft = function(id) {
		var player = this.players[id].player;
		player.destroy();
		delete this.players[id];
	}

	GameController.prototype.updateClientsWorld = function(update_world) {
		this.channel.sendCommandToAllUsers('gameCommand', {worldUpdate: update_world});
	}

	GameController.prototype.updateWorld = function() {
		
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
			//this.serverGame.updateClientsWorld(update);
			this.notificationCenter.trigger("sendCommandToAllUsers", ['gameCommand', {worldUpdate:update}]);
		}

		setTimeout(this.updateWorld.bind(this), Settings.WORLD_UPDATE_BROADCAST_INTERVAL);
	}

	return GameController;
});
