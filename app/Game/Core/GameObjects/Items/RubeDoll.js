define([
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Vendor/RubeLoader",
    "Lib/Vendor/Box2D",
    "Game/Config/Settings",
    "Lib/Utilities/Assert",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Matrix",
    "json!Game/Asset/RubeDoll.json" // using requirejs json loader plugin
],

function (Parent, RubeLoader, Box2D, Settings, Assert, Nc, Matrix, RubeDollJson) {

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

        var count = 0;
        for (var i in this.joints) {
            this.limits[i] = {
                lower: this.joints[i].GetLowerLimit(),
                upper: this.joints[i].GetUpperLimit(),
            };
/*
            this.joints[i].EnableLimit(false);

            if(count < 4 && this.joints[i] instanceof Box2D.Dynamics.Joints.b2RevoluteJoint) {
                console.log(i);
            } else {
                body.GetWorld().DestroyJoint(this.joints[i]);
            }
            count++;
            */
        }
    };

    RubeDoll.prototype.getFixtureDef = function() {
        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
        return fixtureDef;
    };

    RubeDoll.prototype.flip = function(direction) {
        var oldFlipDirection = this.flipDirection;

        Parent.prototype.flip.call(this, direction);

        if(oldFlipDirection != direction) {

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

                    // joint.SetAngle(joint.GetAngle() * -1);
                }
            }
        }
    };

    RubeDoll.prototype.reposition = function(handPosition, direction) {
        var oldPosition = this.getPosition();
        var oldAngle = this.body.GetAngle();
        var oldDirection = this.flipDirection;
        
        // calls flip() at the end of Parent reposition()
        Parent.prototype.reposition.call(this, handPosition, direction);

        var differenceAngle = oldAngle - this.body.GetAngle();

        //this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, 0));

        var offset = Box2D.Common.Math.b2Math.SubtractVV(this.getPosition(), oldPosition);
        var grabAngle = (this.options.grabAngle || 0.001);

        for(var key in this.limbs) {
            var limb = this.limbs[key];

            // Setting position offset first (floor to hand)
            var position = limb.GetPosition().Copy();
            position.Add(offset);
            limb.SetPosition(position);

            // grabing local point to "rotate" around (x, y position transform only)
            var localPoint = this.body.GetLocalPoint(limb.GetPosition().Copy());

            // create rotation matrix from chest rotation difference
            var mat = Box2D.Common.Math.b2Mat22.FromAngle(differenceAngle);

            // matrix multiplication with local limb position
            position = Box2D.Common.Math.b2Math.MulTMV(mat, localPoint);

            // translating back to global position
            var globalPoint = this.body.GetWorldPoint(position);
            limb.SetPosition(globalPoint);

            // relative limb rotating by chest rotation difference
            var d = (oldDirection == direction) ? -1 : 1;
            limb.SetAngle((limb.GetAngle() - differenceAngle) * d);
            
            //limb.SetType(Box2D.Dynamics.b2Body.b2_staticBody);
            //limb.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, 0));
        }
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

    RubeDoll.prototype.setUpdateData = function(update) {
        
        Parent.prototype.setUpdateData.call(this, update);

/*
        for(var name in update.limbs) {
            Assert.number(update.limbs[name].p.x, update.limbs[name].p.y);
            Assert.number(update.limbs[name].a);
            Assert.number(update.limbs[name].lv.x, update.limbs[name].lv.y);
            Assert.number(update.limbs[name].av);

            this.limbs[name].SetAwake(true);
            this.limbs[name].SetPosition(update.limbs[name].p);
            this.limbs[name].SetAngle(update.limbs[name].a);
            this.limbs[name].SetLinearVelocity(update.limbs[name].lv);
            this.limbs[name].SetAngularVelocity(update.limbs[name].av);
        }
        */
    }

    RubeDoll.prototype.destroy = function() {

        var world = this.body.GetWorld();
        
        for (var name in this.limbs) {
            world.DestroyBody(this.limbs[name]);
        }

        Parent.prototype.destroy.call(this);
    };
 
    return RubeDoll;
});