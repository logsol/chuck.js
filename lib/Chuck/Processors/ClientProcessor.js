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

	function ClientGame () {
		this.init();
	};

	ClientGame.prototype.init = function() {
		this.viewController = new ViewController();
	    this.physicsEngine = new PhysicsEngine();
		this.me = new Player(this.physicsEngine, null);
		this.me.spawn(100, 0);
	    this.inputControlUnit = new InputControlUnit(this.me);
  	    this.physicsEngine.setCollisionDetector(this.me);

	    this.update();
	}

	ClientGame.prototype.loadLevel = function(path) {
		if (this.level) {
			this.level.unload();
		}

		this.level = new Level(path, this.physicsEngine);
		this.level.loadLevelInToEngine();
	}

	ClientGame.prototype.getPhysicsEngine = function() {
	    return this.physicsEngine;
	}

	ClientGame.prototype.getMe = function() {
	    return this.me;
	}

	ClientGame.prototype.update  = function() {

		requestAnimFrame(this.update.bind(this));

	    this.physicsEngine.update();
    	this.viewController.update();
    	this.inputControlUnit.update();	
    	this.me.update();
	}

	ClientGame.prototype.destruct = function() {
		
	}

	return ClientGame;
});
