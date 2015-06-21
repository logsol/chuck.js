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
        this.joints = null;
        this.limits = [];

        var chest = null;
        var world = physicsEngine.getWorld();
        this.rubeLoader = new RubeLoader(RubeDollJson, world);

        this.loadRubeDollFromScene(options);

        Parent.call(this, physicsEngine, uid, options);
        world.DestroyBody(this.body);
        this.body = this.limbs.chest;

        this.body.SetUserData(this);

        this.flip(options.direction || 1);
    }

    RubeDoll.prototype = Object.create(Parent.prototype);

    RubeDoll.prototype.loadRubeDollFromScene = function(options) {
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

            // code snipped possibly needed for filtering between doll and rubedoll while holding
            //var filterData = new Box2D.Dynamics.b2FilterData();
            //filterData.groupIndex = -66;
            //if(body.name != "head" && body.name != "chest") {
            //    for (var fixture = body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
            //        fixture.SetFilterData(filterData);
            //    }
            //}
        }

        this.joints = scene.joints;

        for (var i in this.joints) {
            this.limits[i] = {
                lower: this.joints[i].GetLowerLimit(),
                upper: this.joints[i].GetUpperLimit(),
            };
        }
    };

    RubeDoll.prototype.getFixtureDef = function() {
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
        return fixtureDef;
    };

    RubeDoll.prototype.flip = function(direction) {
        Parent.prototype.flip.call(this, direction);

        for (var i in this.joints) {
            var joint = this.joints[i];
            var limits = this.limits[i];

            if (joint instanceof Box2D.Dynamics.Joints.b2RevoluteJoint) {

                if (direction > 0) {
                    joint.SetLimits(limits.lower, limits.upper);
                    continue;
                }

                var a1 = limits.lower * -1;
                var a2 = limits.upper * -1;

                if (a2 > a1) {
                    joint.SetLimits(a1, a2);
                } else {
                    joint.SetLimits(a2, a1);
                }
            }
        }
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

        var world = this.body.GetWorld();
        
        for (var name in this.limbs) {
            world.DestroyBody(this.limbs[name]);
        }

        Parent.prototype.destroy.call(this);
    };
 
    return RubeDoll;
});