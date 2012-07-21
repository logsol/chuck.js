var requires = [
	"Game/Client/View/ViewController", 
	"Game/Core/Physics/Engine", 
	"Game/Core/Player", 
	"Game/Client/Control/KeyboardController", 
	"Game/Config/Settings", 
	"Game/Core/Loader/Level",
	"Lib/Vendor/Box2D",
	"Lib/Utilities/RequestAnimFrame"
];

define(requires, function(ViewController, PhysicsEngine, Player, KeyboardController, Settings, Level, Box2D, requestAnimFrame) {

	function GameController (clientGame) {
		this.clientGame = clientGame;
		this.init();
	};

	GameController.prototype.init = function() {
		this.viewController = new ViewController();
	    this.physicsEngine = new PhysicsEngine();

	    this.update();
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

	GameController.prototype.getMe = function() {
	    return this.me;
	}

	GameController.prototype.update  = function() {

		requestAnimFrame(this.update.bind(this));

	    this.physicsEngine.update();
    	this.viewController.update();

    	if(this.me) {
    		this.KeyboardController.update();	
    		this.me.update();
    	}
	}

	GameController.prototype.destruct = function() {
		
	}

	GameController.prototype.spawnNewPlayerWithId = function(id) {
		var player = new Player(this.physicsEngine, id, null);
		player.spawn(100, 0);
		this.physicsEngine.setCollisionDetector(player);
		return player;
	}

	GameController.prototype.spawnMeWithId = function(id) {
		this.me = this.spawnNewPlayerWithId(id);
		this.KeyboardController = new KeyboardController(this.me, this);
	}

	GameController.prototype.sendGameCommand = function(command, options) {
		this.clientGame.sendGameCommand(command, options);
	}

	GameController.prototype.processGameCommand = function(command, options) {
		
		if (command == "worldUpdate") {

			var body = this.physicsEngine.world.GetBodyList();
			do {
				var userData = body.GetUserData();
				if(userData && options[userData]) {		
					var update = options[userData];
								
					//console.log('position difference:', (body.GetPosition().y - update.p.y) * 30, body.GetLinearVelocity().y);
					
					body.SetAwake(true);			
					body.SetPosition(update.p);
					body.SetAngle(update.a);
					body.SetLinearVelocity(update.lv);
					body.SetAngularVelocity(update.av);
				}
			} while (body = body.GetNext());

		}

	}

	return GameController;
});
