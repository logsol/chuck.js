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

define(requires, function(ViewController, PhysicsEngine, Player, InputControlUnit, Settings, Box2D, Level, requestAnimFrame){

	function Processor () {
		if(Settings.IS_BROWSER_ENVIRONMENT) {
			this.initClient();
		} else {
			this.initServer();
		}
	};

	Processor.prototype.initClient = function() {
		this.viewController = new ViewController();
	    this.physicsEngine = new PhysicsEngine();
		this.me = new Player(this.physicsEngine, null);
		this.me.spawn(100, 0);
	    this.inputControlUnit = new InputControlUnit(this.me);
  	    this.physicsEngine.setCollisionDetector(this.me);

	    this.update();
	}

	Processor.prototype.initServer = function() {
	    this.physicsEngine = new PhysicsEngine();
  	    //this.physicsEngine.setCollisionDetector(players);

	    this.update();
	}

	Processor.prototype.loadLevel = function(path) {
		if (this.level) {
			this.level.unload();
		}

		this.level = new Level(path, this.physicsEngine);
		this.level.loadLevelInToEngine();
	}

	Processor.prototype.getPhysicsEngine = function() {
	    return this.physicsEngine;
	}

	Processor.prototype.getMe = function() {
	    return this.me;
	}

	Processor.prototype.update  = function() {


		requestAnimFrame(this.update.bind(this));

		//console.log(self.physicsEngine.getWorld().GetBodyList().GetPosition());

	    this.physicsEngine.update();
	    
	    if(Settings.IS_BROWSER_ENVIRONMENT) {
	    	this.viewController.update();
	    	this.inputControlUnit.update();	
	    	this.me.update();
	    	//self.camera.update();
	    	//self.repository.update();
	    }
	}

	Processor.prototype.destruct = function() {
		
	}

	return Processor;
});
