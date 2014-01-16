define([
    "Game/Config/Settings",
    "Lib/Vendor/Box2D",
    "Game/" + GLOBALS.context + "/Collision/Detector"
],

function (Settings, Box2D, CollisionDetector) {

    function Engine () {
        this.world = new Box2D.Dynamics.b2World(
            new Box2D.Common.Math.b2Vec2(0, Settings.BOX2D_GRAVITY),
            Settings.BOX2D_ALLOW_SLEEP
        );
        this.world.SetWarmStarting(true);
        this.ground = null;
        this.lastStep = Date.now();
    }

    Engine.prototype.getWorld = function () {
        return this.world;
    }

    Engine.prototype.getGround = function () {
        return this.ground;
    }

    Engine.prototype.setCollisionDetector = function (player) {
        
        var detector = new CollisionDetector(player); 
        this.world.SetContactListener(detector.getListener());
    }

    Engine.prototype.createBody = function (bodyDef) {
        var body = this.world.CreateBody(bodyDef);
        if(!this.ground) this.ground = body;
        return body;
    }

    Engine.prototype.update = function () {
        var stepLength = (Date.now() - this.lastStep) / 1000;
        this.world.Step(stepLength, Settings.BOX2D_VELOCITY_ITERATIONS, Settings.BOX2D_POSITION_ITERATIONS);
        this.lastStep = Date.now();
        this.world.ClearForces();
    }

    return Engine;
});