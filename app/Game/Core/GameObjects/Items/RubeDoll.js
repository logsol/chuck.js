define([
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Vendor/RubeLoader", // Re-enabled for Planck.js
    "Lib/Vendor/Planck",
    "Game/Config/Settings",
    "Lib/Utilities/Assert",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Matrix",
    "json!Game/Asset/RubeDoll.json" // Re-enabled for Planck.js
],

function (Parent, RubeLoader, planck, Settings, Assert, nc, Matrix, RubeDollJson) {

	"use strict";
 
    function RubeDoll(physicsEngine, uid, options) {
        Assert.number(options.x, options.y);

        this.rubeLoader = null;
        this.body = null;
        this.limbs = {};
        this.joints = null;
        this.limits = [];

        var chest = null;
        this.rubeLoader = new RubeLoader(RubeDollJson, physicsEngine.getWorldForRubeLoader());
        this.loadRubeDollFromScene(options);

        Parent.call(this, physicsEngine, uid, options);
        physicsEngine.destroyBody(this.body);
        this.body = this.limbs.chest;
        delete this.limbs.chest;

        this.body.setUserData(this);

        this.flip(options.direction || 1);
    }

    RubeDoll.prototype = Object.create(Parent.prototype);

    RubeDoll.prototype.loadRubeDollFromScene = function(options) {
        var scene = this.rubeLoader.getScene();

        for (var i in scene.bodies) {
            var body = scene.bodies[i];
            var position = body.getPosition().clone();
            position.add(planck.Vec2(
                options.x / Settings.RATIO, 
                options.y / Settings.RATIO
            ));
            body.setPosition(position);
            this.limbs[body.name] = body;

            // code snipped possibly needed for filtering between doll and rubedoll while holding
            //var filterData = new planck.Filter();
            //filterData.groupIndex = -66;
            //if(body.name != "head" && body.name != "chest") {
            //    for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
            //        fixture.setFilterData(filterData);
            //    }
            //}
        }

        this.joints = scene.joints;

        var count = 0;
        for (var i in this.joints) {
            this.limits[i] = {
                lower: this.joints[i].getLowerLimit(),
                upper: this.joints[i].getUpperLimit(),
            };
/*
            this.joints[i].enableLimit(false);

            if(count < 4 && this.joints[i] instanceof planck.RevoluteJoint) {
                console.log(i);
            } else {
                body.getWorld().destroyJoint(this.joints[i]);
            }
            count++;
            */
        }
    };

    RubeDoll.prototype.getFixtureDef = function() {
        var fixtureDef = { shape: null, density: 1.0, friction: 0.3, restitution: 0.0, isSensor: false };
        fixtureDef.shape = planck.Circle(0.1); // Small circle as placeholder
        return fixtureDef;
    };

    RubeDoll.prototype.flip = function(direction) {
        var oldFlipDirection = this.flipDirection;

        Parent.prototype.flip.call(this, direction);

        if(oldFlipDirection != direction) {

            for (var i in this.joints) {
                var joint = this.joints[i];
                var limits = this.limits[i];

                if (joint instanceof planck.RevoluteJoint) {

                    if (direction > 0) {
                        joint.setLimits(limits.lower, limits.upper);
                        continue;
                    }

                    var a1 = limits.lower * -1;
                    var a2 = limits.upper * -1;

                    if (a2 > a1) {
                        joint.setLimits(a1, a2);
                    } else {
                        joint.setLimits(a2, a1);
                    }

                    // joint.setAngle(joint.getAngle() * -1);
                }
            }
        }
    };

    RubeDoll.prototype.reposition = function(handPosition, direction) {
        var oldPosition = this.getPosition();
        var oldAngle = this.body.getAngle();
        var oldDirection = this.flipDirection;
        
        // calls flip() at the end of Parent reposition()
        Parent.prototype.reposition.call(this, handPosition, direction);

        var differenceAngle = oldAngle - this.body.getAngle();

        //this.body.setLinearVelocity(planck.Vec2(0, 0));

        var offset = planck.Vec2(this.getPosition()).sub(planck.Vec2(oldPosition));
        var grabAngle = (this.options.grabAngle || 0.001);

        for(var key in this.limbs) {
            var limb = this.limbs[key];

            // Setting position offset first (floor to hand)
            var position = limb.getPosition().clone();
            position.add(offset);
            limb.setPosition(position);

            // grabing local point to "rotate" around (x, y position transform only)
            var localPoint = this.body.getLocalPoint(limb.getPosition().clone());

            // create rotation from chest rotation difference
            var rot = planck.Rot(differenceAngle);

            // rotate the local point using static method
            var rotatedPoint = planck.Rot.mul(rot, localPoint);

            // translating back to global position
            var globalPoint = this.body.getWorldPoint(rotatedPoint);
            limb.setPosition(globalPoint);

            // relative limb rotating by chest rotation difference
            var d = (oldDirection == direction) ? -1 : 1;
            limb.setAngle((limb.getAngle() - differenceAngle) * d);
            
            //limb.setType('static');
            //limb.setLinearVelocity(planck.Vec2(0, 0));
        }
    };

    RubeDoll.prototype.setVelocities = function(options) {
        Assert.number(options.linearVelocity.x, options.linearVelocity.y);
        Assert.number(options.angularVelocity);

        this.body.setLinearVelocity(options.linearVelocity);
        this.body.setAngularVelocity(options.angularVelocity);
        for(var name in this.limbs) {
            this.limbs[name].setLinearVelocity(options.linearVelocity);
        }
    };

    RubeDoll.prototype.getPosition = function() {
        return this.body.getPosition().clone();
    };

    RubeDoll.prototype.getHeadPosition = function() {
        return this.limbs.head.getPosition().clone();
    };

    RubeDoll.prototype.setUpdateData = function(update) {
        
        Parent.prototype.setUpdateData.call(this, update);

        for(var name in update.limbs) {
            Assert.number(update.limbs[name].p.x, update.limbs[name].p.y);
            Assert.number(update.limbs[name].a);
            Assert.number(update.limbs[name].lv.x, update.limbs[name].lv.y);
            Assert.number(update.limbs[name].av);

            this.limbs[name].setAwake(true);
            this.limbs[name].setPosition(update.limbs[name].p);
            this.limbs[name].setAngle(update.limbs[name].a);
            this.limbs[name].setLinearVelocity(update.limbs[name].lv);
            this.limbs[name].setAngularVelocity(update.limbs[name].av);
        }
    }

    RubeDoll.prototype.destroy = function() {

        var world = this.body.getWorld();
        
        for (var name in this.limbs) {
            world.destroyBody(this.limbs[name]);
        }

        Parent.prototype.destroy.call(this);
    };
 
    return RubeDoll;
});