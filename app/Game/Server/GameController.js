define([
	"Game/Core/GameController",
	"Game/Core/Physics/Engine", 
	"Game/Config/Settings", 
	"Game/Core/Control/InputController",
	"Lib/Utilities/RequestAnimFrame",
	"Game/Server/NotificationCenter"
],

function(Parent, PhysicsEngine, Settings, InputController, requestAnimFrame, NotificationCenter) {

	function GameController () {
		Parent.call(this, new PhysicsEngine());

		this.inputControllers = {};

		this.update();
	    this.updateWorld();
	}

	GameController.prototype = Object.create(Parent.prototype);
	console.log(GameController.loadLevel);

	GameController.prototype.update  = function() {

		requestAnimFrame(this.update.bind(this));

	    this.physicsEngine.update();
	    for(var id in this.players) {
	    	this.players[id].player.update();
	    }
	}

	GameController.prototype.userJoined = function(user) {
		var player = Parent.prototype.userJoined.call(this, user);
		this.inputControllers[player.id] = new InputController(player);
	}

	GameController.prototype.userLeft = function(user) {
		Parent.prototype.userLeft.call(this, user);
		delete this.inputControllers[user.id];
	}

	GameController.prototype.progressGameCommandFromUser = function(command, options, user) {
		var inputController = this.inputControllers[user.id];
		if (typeof inputController[command] == 'function') {
			inputController[command](options);
		}
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
			NotificationCenter.trigger("sendCommandToAllUsers", ['gameCommand', {worldUpdate:update}]);
		}

		setTimeout(this.updateWorld.bind(this), Settings.WORLD_UPDATE_BROADCAST_INTERVAL);
	}

	return GameController;
});
