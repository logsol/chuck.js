Game.Physics.Engine = function () {
    this._world;
    
    this.init();
}

Game.Physics.Engine.prototype.init = function() {
    this._world = this._initBox2d();
    this.setupDebugDraw();
    
    var doll = new Game.Physics.Doll(this._world);
    doll.spawn(100,100);
}

Game.Physics.Engine.prototype._initBox2d = function() {
    return new Game.b2World(new Game.b2Vec2(0,Game.Settings.BOX2D_GRAVITY), Game.Settings.BOX2D_ALLOW_SLEEP);
}

Game.Physics.Engine.prototype.getWorld = function() {
    return this._world;
}

Game.Physics.Engine.prototype.setCollisionDetector = function() {
    var cd = new CollisionDetector();
    this._world.SetContactListener(cd);
}

Game.Physics.Engine.prototype.setupDebugDraw = function() {
    //var debugSprite = new Sprite();
    //View.getInstance().add(debugSprite);

    var debugSprite = document.getElementById("canvas").getContext("2d");

    // set debug draw
    var dbgDraw = new Game.b2DebugDraw();

    dbgDraw.SetSprite(debugSprite);
    dbgDraw.SetDrawScale(Game.Settings.RATIO);
    dbgDraw.SetAlpha(0.5);
    dbgDraw.SetFillAlpha(0.1);
    dbgDraw.SetLineThickness(0);

    dbgDraw.SetFlags(null
        | Game.b2DebugDraw.e_shapeBit 
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

Game.Physics.Engine.prototype.createBody = function(bodyDef) {
    return this._world.CreateBody(bodyDef);
}

Game.Physics.Engine.prototype.update = function() {
    this._world.Step(Game.Settings.BOX2D_TIME_STEP, Game.Settings.BOX2D_VELOCITY_ITERATIONS, Game.Settings.BOX2D_POSITION_ITERATIONS);
    this._world.ClearForces();
    this._world.DrawDebugData();
}
