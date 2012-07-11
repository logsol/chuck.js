define(["Chuck/Settings", "Box2D/Box2D", "Chuck/Collision/Detector"], function(Settings, Box2D, CollisionDetector){

	function Engine () {
	    this.world;
	    this.init();
	}

	Engine.prototype.init = function() {
	    this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, Settings.BOX2D_GRAVITY), Settings.BOX2D_ALLOW_SLEEP);

	    if(Settings.IS_BROWSER_ENVIRONMENT) {
	    	this.setupDebugDraw();
	    }
	}

	Engine.prototype.getWorld = function() {
	    return this.world;
	}

	Engine.prototype.setCollisionDetector = function(me) {
		
	    var detector = new CollisionDetector(me);
	    this.world.SetContactListener(detector.getListener());
	}

	Engine.prototype.setupDebugDraw = function() {
	    //var debugSprite = Settings.DEBUG_DRAW_CANVAS_SPRITE;
		var debugSprite = document.getElementById("canvas").getContext("2d");

	    // set debug draw
	    var debugDraw = new Box2D.Dynamics.b2DebugDraw();

	    debugDraw.SetSprite(debugSprite);
	    debugDraw.SetDrawScale(Settings.RATIO);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(1.0);

	    debugDraw.SetFlags(null
	        | Box2D.Dynamics.b2DebugDraw.e_shapeBit 
		    | Box2D.Dynamics.b2DebugDraw.e_jointBit 
		    //| Box2D.Dynamics.b2DebugDraw.e_coreShapeBit
		    //| Box2D.Dynamics.b2DebugDraw.e_aabbBit
		    //| Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit
		    //| Box2D.Dynamics.b2DebugDraw.e_obbBit
		    //| Box2D.Dynamics.b2DebugDraw.e_pairBit
		);

	    this.world.SetDebugDraw(debugDraw);
	    this.world.SetWarmStarting(true);
	}

	Engine.prototype.createBody = function(bodyDef) {
	    return this.world.CreateBody(bodyDef);
	}

	Engine.prototype.update = function() {
	    this.world.Step(Settings.BOX2D_TIME_STEP, Settings.BOX2D_VELOCITY_ITERATIONS, Settings.BOX2D_POSITION_ITERATIONS);
	    this.world.ClearForces();
	    this.world.DrawDebugData();
	}

	return Engine;
})