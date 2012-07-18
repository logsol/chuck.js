var requires = [
	"Chuck/View/ViewController", 
	"Chuck/Physics/Engine", 
	"Chuck/Player", 
	"Chuck/Control/InputControlUnit", 
	"Chuck/Settings", 
	"Vendor/Box2D",
	"Chuck/Loader/Level",
	"RequestAnimationFrame"
];

define(requires,
	function(ViewController, PhysicsEngine, Player, InputControlUnit, Settings, Box2D, Level, requestAnimFrame) {

	function ClientProcessor (clientGame) {
		this.clientGame = clientGame;
		this.init();
	};

	ClientProcessor.prototype.init = function() {
		this.viewController = new ViewController();
	    this.physicsEngine = new PhysicsEngine();

	    this.update();
	}

	ClientProcessor.prototype.loadLevel = function(path) {
		if (this.level) {
			this.level.unload();
		}

		this.level = new Level(path, this.physicsEngine);
		this.level.loadLevelInToEngine();
	}

	ClientProcessor.prototype.getPhysicsEngine = function() {
	    return this.physicsEngine;
	}

	ClientProcessor.prototype.getMe = function() {
	    return this.me;
	}

	ClientProcessor.prototype.update  = function() {

		requestAnimFrame(this.update.bind(this));

	    this.physicsEngine.update();
    	this.viewController.update();

    	if(this.me) {
    		this.inputControlUnit.update();	
    		this.me.update();
    	}
	}

	ClientProcessor.prototype.destruct = function() {
		
	}

	ClientProcessor.prototype.spawnNewPlayerWithId = function(id) {
		var player = new Player(this.physicsEngine, id, null);
		player.spawn(100, 0);
		this.physicsEngine.setCollisionDetector(player);
		return player;
	}

	ClientProcessor.prototype.spawnMeWithId = function(id) {
		this.me = this.spawnNewPlayerWithId(id);
		this.inputControlUnit = new InputControlUnit(this.me, this);
	}

	ClientProcessor.prototype.sendGameCommand = function(command, options) {
		this.clientGame.sendGameCommand(command, options);
	}

	ClientProcessor.prototype.processGameCommand = function(command, options) {
		
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

	return ClientProcessor;
});
