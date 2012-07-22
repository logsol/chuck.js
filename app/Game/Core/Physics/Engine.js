define([
	"Game/Config/Settings",
	"Lib/Vendor/Box2D",
	"Game/Core/Collision/Detector"
],

function(Settings, Box2D, CollisionDetector) {

	function Engine () {
	    this.world = new Box2D.Dynamics.b2World(
	    	new Box2D.Common.Math.b2Vec2(0, Settings.BOX2D_GRAVITY),
	    	Settings.BOX2D_ALLOW_SLEEP
	    );
	}

	Engine.prototype.getWorld = function() {
	    return this.world;
	}

	Engine.prototype.setCollisionDetector = function(me) {
		
	    var detector = new CollisionDetector(me); // FIXME: check if core collision detector works
	    this.world.SetContactListener(detector.getListener());
	}

	Engine.prototype.createBody = function(bodyDef) {
	    return this.world.CreateBody(bodyDef);
	}

	Engine.prototype.update = function() {
	    this.world.Step(Settings.BOX2D_TIME_STEP, Settings.BOX2D_VELOCITY_ITERATIONS, Settings.BOX2D_POSITION_ITERATIONS);
	    this.world.ClearForces();
	}

	return Engine;
});