define([
    "Game/Config/Settings",
    "Lib/Vendor/Box2D",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Lib/Utilities/NotificationCenter"
],

function (Settings, Box2D, CollisionDetector, Nc) {

	"use strict";

    function Engine () {
        this.world = new Box2D.Dynamics.b2World(
            new Box2D.Common.Math.b2Vec2(0, Settings.BOX2D_GRAVITY),
            Settings.BOX2D_ALLOW_SLEEP
        );
        this.world.SetWarmStarting(true);
        this.lastStep = Date.now();
        this.worldQueue = [];

        this.ncTokens = [
            Nc.on(Nc.ns.channel.engine.worldQueue.add, this.addToWorldQueue, this)
        ];
    }

    Engine.prototype.setCollisionDetector = function () {
        
        var detector = new CollisionDetector(); 
        this.world.SetContactListener(detector.getListener());
    }

    Engine.prototype.getWorldForRubeLoader = function() {
        return this.world;
    };

    Engine.prototype.createBody = function (bodyDef) {
        return this.world.CreateBody(bodyDef);
    }

    Engine.prototype.destroyBody = function (body) {
        return this.world.DestroyBody(body);
    }

    Engine.prototype.addToWorldQueue = function(callback) {
        this.worldQueue.push(callback);
    };

    Engine.prototype.processWorldQueue = function() {
        for (var i = 0; i < this.worldQueue.length; i++) {
            this.worldQueue[i]();
        };

        this.worldQueue = [];
    };

    Engine.prototype.update = function () {
        var stepLength = (Date.now() - this.lastStep) / 1000;
        this.world.Step(stepLength, Settings.BOX2D_VELOCITY_ITERATIONS, Settings.BOX2D_POSITION_ITERATIONS);
        this.lastStep = Date.now();
        this.world.ClearForces();
        this.processWorldQueue();
    }

    Engine.prototype.destroy = function() {
        Nc.offAll(this.ncTokens);
        delete this.world;
    };


    return Engine;
});