define(["Chuck/Settings", "Box2D/Box2D"], function(Settings, Box2D){

	function Engine () {
	    this._world;
	    this.init();
	}

	Engine.prototype.init = function() {
	    this._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, Settings.Box2D_GRAVITY), Settings.Box2D_ALLOW_SLEEP);

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
	    var debugSprite = Settings.DEBUG_DRAW_CANVAS_SPRITE;
	    console.log(debugSprite);

	    // set debug draw
	    var dbgDraw = new Box2D.Dynamics.b2DebugDraw();

	    dbgDraw.SetSprite(debugSprite);
	    dbgDraw.SetDrawScale(Settings.RATIO);
	    dbgDraw.SetAlpha(0.5);
	    dbgDraw.SetFillAlpha(0.1);
	    dbgDraw.SetLineThickness(0);

	    dbgDraw.SetFlags(null
	        | dbgDraw.e_shapeBit 
	    //| b2DebugDraw.e_jointBit 
	    //| b2DebugDraw.e_coreShapeBit
	    //| b2DebugDraw.e_aabbBit
	    //| b2DebugDraw.e_centerOfMassBit
	    //| b2DebugDraw.e_obbBit
	    //| b2DebugDraw.e_pairBit
	);

	    this._world.SetDebugDraw(dbgDraw);

	    this._world.SetWarmStarting(true);
	    console.log('Debug Draw was set up');
	}

	Engine.prototype.createBody = function(bodyDef) {
	    return this._world.CreateBody(bodyDef);
	}

	Engine.prototype.update = function() {
	    this._world.Step(Settings.Box2D_TIME_STEP, Settings.Box2D_VELOCITY_ITERATIONS, Settings.Box2D_POSITION_ITERATIONS);
	    this._world.ClearForces();
	    this._world.DrawDebugData();
	}

	return Engine;
})