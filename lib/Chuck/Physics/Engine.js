Chuck.Physics.Engine = function () {
    this._world;
    
    this.init();
}

Chuck.Physics.Engine.prototype.init = function() {
    this._world = this._initBox2d();
    this.setupDebugDraw();
}

Chuck.Physics.Engine.prototype._initBox2d = function() {
    return new Chuck.b2World(new Chuck.b2Vec2(0,Chuck.Settings.BOX2D_GRAVITY), Chuck.Settings.BOX2D_ALLOW_SLEEP);
}

Chuck.Physics.Engine.prototype.getWorld = function() {
    return this._world;
}

Chuck.Physics.Engine.prototype.setCollisionDetector = function() {
    var cd = new CollisionDetector();
    this._world.SetContactListener(cd);
}

Chuck.Physics.Engine.prototype.setupDebugDraw = function() {
    //var debugSprite = new Sprite();
    //View.getInstance().add(debugSprite);

    var debugSprite = document.getElementById("canvas").getContext("2d");

    // set debug draw
    var dbgDraw = new Chuck.b2DebugDraw();

    dbgDraw.SetSprite(debugSprite);
    dbgDraw.SetDrawScale(Chuck.Settings.RATIO);
    dbgDraw.SetAlpha(0.5);
    dbgDraw.SetFillAlpha(0.1);
    dbgDraw.SetLineThickness(0);

    dbgDraw.SetFlags(null
        | Chuck.b2DebugDraw.e_shapeBit 
    //| b2DebugDraw.e_jointBit 
    //| b2DebugDraw.e_coreShapeBit
    //| b2DebugDraw.e_aabbBit
    //| b2DebugDraw.e_centerOfMassBit
    //| b2DebugDraw.e_obbBit
    //| b2DebugDraw.e_pairBit
);

    this._world.SetDebugDraw(dbgDraw);

    this._world.SetWarmStarting(true);
}

Chuck.Physics.Engine.prototype.createBody = function(bodyDef) {
    return this._world.CreateBody(bodyDef);
}

Chuck.Physics.Engine.prototype.update = function() {
    this._world.Step(Chuck.Settings.BOX2D_TIME_STEP, Chuck.Settings.BOX2D_VELOCITY_ITERATIONS, Chuck.Settings.BOX2D_POSITION_ITERATIONS);
    this._world.ClearForces();
    this._world.DrawDebugData();
}
