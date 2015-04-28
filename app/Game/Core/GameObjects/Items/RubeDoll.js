define([
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Vendor/RubeLoader",
    "Lib/Vendor/Box2D",
    "Game/Config/Settings",
    "Lib/Utilities/Assert",
    "Lib/Utilities/NotificationCenter",
    "json!Game/Asset/RubeDoll.json" // using requirejs json loader plugin
],

function (Parent, RubeLoader, Box2D, Settings, Assert, Nc, RubeDollJson) {

	"use strict";
 
    function RubeDoll(physicsEngine, uid, options) {
        Assert.number(options.x, options.y);

        this.rubeLoader = null;
        this.body = null;
        this.limbs = {};

        var chest = null;
        var world = physicsEngine.getWorld();
        this.rubeLoader = new RubeLoader(RubeDollJson, world);
        var scene = this.rubeLoader.getScene();

        for (var i in scene.bodies) {
            var body = scene.bodies[i];
            var position = body.GetPosition().Copy();
            position.Add(new Box2D.Common.Math.b2Vec2(
                options.x / Settings.RATIO, 
                options.y / Settings.RATIO
            ));
            body.SetPosition(position);
            this.limbs[body.name] = body;
        }

        Parent.call(this, physicsEngine, uid, options);
        world.DestroyBody(this.body);
        this.body = this.limbs.chest;

        var def = this.body.GetDefinition();
        def.userData = this;
        this.body.SetUserData(this);
    }

    RubeDoll.prototype = Object.create(Parent.prototype);

    RubeDoll.prototype.getFixtureDef = function() {
         
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
        return fixtureDef;
    };

    RubeDoll.prototype.flip = function(direction) {
        Parent.prototype.flip.call(this, direction);
        // Extend
    };

    RubeDoll.prototype.reposition = function(handPosition, direction) {

        Parent.prototype.reposition.call(this, handPosition, direction);

        var position = new Box2D.Common.Math.b2Vec2(
            handPosition.x + ((6 / Settings.RATIO) * direction),
            handPosition.y
        );

        this.body.SetPosition(position);
    };

    RubeDoll.prototype.setVelocities = function(options) {
        Assert.number(options.linearVelocity.x, options.linearVelocity.y);
        Assert.number(options.angularVelocity);

        this.body.SetLinearVelocity(options.linearVelocity);
        this.body.SetAngularVelocity(options.angularVelocity);
        for(var name in this.limbs) {
            this.limbs[name].SetLinearVelocity(options.linearVelocity);
        }
    };

    RubeDoll.prototype.getPosition = function() {
        return this.body.GetPosition().Copy();
    };

    RubeDoll.prototype.getHeadPosition = function() {
        return this.limbs.head.GetPosition().Copy();
    };

    RubeDoll.prototype.destroy = function() {

        Nc.trigger(Nc.ns.core.game.gameObject.remove, "animated", this);
        var world = this.body.GetWorld();
        
        for (var name in this.limbs) {
            world.DestroyBody(this.limbs[name]);
        }

        Parent.prototype.destroy.call(this);
    };
 
    return RubeDoll;
});