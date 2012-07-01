var requires = [
	"Chuck/Physics/Engine", 
	"Chuck/Player", 
	"Chuck/Control/InputControlUnit", 
	"Chuck/Settings", 
	"Box2D/Box2D"
];

define(requires, function(PhysicsEngine, Player, InputControlUnit, Settings, Box2D){

	function Processor () {
	    this._me;
	    this._physicsEngine;
	    this._camera;
	    this._repository;
	    this._inputControlUnit;
	    this._keyboardInput;

	    this._bodyDef;

	    this.init();
	};

	Processor.prototype.init = function() {

	    this._physicsEngine = new PhysicsEngine();
	    this._makeBox();
	    
		if(Settings.IS_BROWSER_ENVIRONMENT) {

			this._me = new Player(this._physicsEngine, null);
			this._me.spawn(100, 0);
		    
	  	    this._inputControlUnit = new InputControlUnit(this._me);
	  	    //this._camera = Camera.getInstance()
	  	    //this._camera.follow(this._me);
	  	    //this._repository = Repository.getInstance();
	  	    //this._physicsEngine.setCollisionDetector(this._me);
		}
	    
	    //new Chuck.Loader.Level(this._physicsEngine);
	    //new Items();

	    setInterval(this._update, 1000/60, this);
	}


	Processor.prototype._makeBox = function() {
		var world = this._physicsEngine.getWorld();

		var fixDef = new Box2D.Dynamics.b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.99;
		fixDef.restitution = .51;
		var bodyDef = new Box2D.Dynamics.b2BodyDef;
			 
		// create ground
		bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
		fixDef.shape.SetAsBox(20, 2);
		bodyDef.position.Set(10, 400 / 30 + 1.8);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		bodyDef.position.Set(10, -1.8);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		fixDef.shape.SetAsBox(2, 14);
		bodyDef.position.Set(-1.8, 13);
		world.CreateBody(bodyDef).CreateFixture(fixDef);
		bodyDef.position.Set(21.8, 13);
		world.CreateBody(bodyDef).CreateFixture(fixDef);

		// create object
		bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
		fixDef.shape.SetAsBox(0.4, 0.4);
		bodyDef.position.x = 10;
		bodyDef.position.y = 2;
		bodyDef.userData = {
			'bodyId': 1 + '' 
		};

		world.CreateBody(bodyDef).CreateFixture(fixDef);
		this._bodyDef = bodyDef;
	}

	Processor.prototype.getPhysicsEngine = function() {
	    return this._physicsEngine;
	}

	Processor.prototype.getMe = function() {
	    return this._me;
	}

	Processor.prototype._update  = function(self) {

		//console.log(self._physicsEngine.getWorld().GetBodyList().GetPosition());

	    self._physicsEngine.update();
	    
	    if(Settings.IS_BROWSER_ENVIRONMENT) {
	    	self._inputControlUnit.update();	
	    	self._me.update();
	    	//self._camera.update();
	    	//self._repository.update();
	    }
	}

	return Processor;
});
