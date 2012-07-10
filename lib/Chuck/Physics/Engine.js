define(["Chuck/Settings", "Box2D/Box2D"], function(Settings, Box2D){

	function Engine () {
	    this._world;
	    this.init();
	}

	Engine.prototype.init = function() {
	    this._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, Settings.BOX2D_GRAVITY), Settings.BOX2D_ALLOW_SLEEP);

	    if(Settings.IS_BROWSER_ENVIRONMENT) {
	    	this.setupDebugDraw();
	    }
	}

	Engine.prototype.getWorld = function() {
	    return this._world;
	}

	Engine.prototype.setCollisionDetector = function(me) {
		/*
	    var cd = new Chuck.Collision.Detector(me);
	    var listener = cd.getListener();
	    this._world.SetContactListener(listener);*/
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

	    this._world.SetDebugDraw(debugDraw);
	    this._world.SetWarmStarting(true);
	}

	Engine.prototype.createBody = function(bodyDef) {
	    return this._world.CreateBody(bodyDef);
	}

	Engine.prototype.update = function() {
	    this._world.Step(Settings.BOX2D_TIME_STEP, Settings.BOX2D_VELOCITY_ITERATIONS, Settings.BOX2D_POSITION_ITERATIONS);
	    this._world.ClearForces();
	    this._world.DrawDebugData();
	}

	return Engine;
})