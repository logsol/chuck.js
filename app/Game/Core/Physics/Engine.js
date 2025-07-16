define([
    "Game/Config/Settings",
    "Lib/Vendor/Planck",
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Lib/Utilities/NotificationCenter"
],

function (Settings, planck, CollisionDetector, nc) {

	"use strict";

    function Engine () {
        this.world = planck.World({
            gravity: planck.Vec2(0, Settings.BOX2D_GRAVITY)
        });
        this.lastStep = Date.now();
        this.worldQueue = [];

        this.ncTokens = [
            nc.on(nc.ns.channel.engine.worldQueue.add, this.addToWorldQueue, this)
        ];
    }

    Engine.prototype.setCollisionDetector = function () {
        
        var detector = new CollisionDetector(); 
        this.world.on('begin-contact', detector.getListener());
    }

    Engine.prototype.getWorldForRubeLoader = function() {
        return this.world;
    };

    Engine.prototype.createBody = function (bodyDef) {
        return this.world.createBody(bodyDef);
    }

    Engine.prototype.destroyBody = function (body) {
        return this.world.destroyBody(body);
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
        this.world.step(stepLength, Settings.BOX2D_VELOCITY_ITERATIONS, Settings.BOX2D_POSITION_ITERATIONS);
        this.lastStep = Date.now();
        this.world.clearForces();
        this.processWorldQueue();
    }

    Engine.prototype.destroy = function() {
        nc.offAll(this.ncTokens);
        delete this.world;
    };


    return Engine;
});