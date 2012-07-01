define(["Chuck/Physics/Engine", "Box2D/Box2D"], function(PhysicsEngine, Box2D){

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

	    
	    //this._me = new Chuck.Player(this._physicsEngine, this._repository);

	    /*
	    //this._camera = Camera.getInstance()
	    //this._repository = Repository.getInstance();
	    this._physicsEngine.setCollisionDetector(this._me);
	    this._keyboardInput = new Chuck.Control.KeyboardInput();
	    this._inputControlUnit = new Chuck.Control.InputControlUnit(this._keyboardInput, this._me);

	    new Chuck.Loader.Level(this._physicsEngine);
	    //new Items();

	    this._me.spawn(100, 0);
	    //this._camera.follow(this._me);
*/
	    setInterval(this._update, 1000/60, this);
	    //View.getInstance().getSprite().addEventListener(Event.ENTER_FRAME, this._update)
	}

	Processor.prototype.getPhysicsEngine = function() {
	    return this._physicsEngine;
	}

	Processor.prototype.getMe = function() {
	    return this._me;
	}

	Processor.prototype._update  = function(self) {
	    self._physicsEngine.update();

	    //console.log(self._physicsEngine.getWorld().GetBodyList().GetPosition());

	    //self._repository.update();
	    //self._keyboardInput.update();
	    //self._me.update();
	    //self._camera.update();
	}
	



	return Processor;
});
