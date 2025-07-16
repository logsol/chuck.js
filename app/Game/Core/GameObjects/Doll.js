define([
    "Game/" + GLOBALS.context + "/GameObjects/GameObject",
    "Lib/Utilities/Exception",
    "Lib/Vendor/Planck", 
    "Game/Config/Settings", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Item",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert"
], 

function (Parent, Exception, planck, Settings, CollisionDetector, Item, nc, Assert) {

	"use strict";

    function Doll (physicsEngine, uid, player) {

        this.characterName = "Chuck";
        this.player = player;
        this.height = 37;
        this.width = 9;
        this.headHeight = 12;
        this.reachDistance = 20;
        this.areaSize = 35;

        Parent.call(this, physicsEngine, uid);

        this.standing = false;
        this.moveDirection = 0;
        this.lookDirection = 0;
        this.legs = null;
        this.footSensor = null;
        this.actionState = null;
        this.lookAtXY = { x:0, y:0 };
        this.reachableItems = {
            left: [],
            right: []
        };
        this.nearbyDolls = [];
        this.holdingJoint = null;
        this.holdingItem = null;

        this.ragDoll = {head: null, body: null}; // FIXME: wtf is this? can we remove it?
        
        this.createFixtures();
        this.body.setActive(false);

        nc.trigger(nc.ns.core.game.worldUpdateObjects.add, this);
    }

    Doll.prototype = Object.create(Parent.prototype);

    Doll.prototype.getBodyDef = function() {
        var bodyDef = {
            position: planck.Vec2(0, 0),
            fixedRotation: true,
            linearDamping: Settings.PLAYER_LINEAR_DAMPING,
            type: 'dynamic'
        };
        return bodyDef;
    };

    Doll.prototype.createFixtures = function () {
        Assert.number(this.width, this.height);
        Assert.number(this.reachDistance);
        Assert.number(this.areaSize);

        var self = this;

        var fixtureDef = { shape: null, density: 1.0, friction: 0.3, restitution: 0.0, isSensor: false };
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = 0;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;

        var radius = this.width / 2 / Settings.RATIO;
        var headShape = planck.Circle(
            radius,
            planck.Vec2(0, -(this.height - (this.width / 2)) / Settings.RATIO)
        );
        fixtureDef.shape = headShape;
        fixtureDef.isSensor = false;
        fixtureDef.userData = {
            onCollisionChange: this.onImpact.bind(this)
        };

        this.body.createFixture(fixtureDef);

        var bodyShape = planck.Box(
            this.width / 2 / Settings.RATIO, 
            (this.height - this.width) / 2 / Settings.RATIO, 
            planck.Vec2(0, -this.height / 2 / Settings.RATIO),
            0
        );
        fixtureDef.shape = bodyShape;
        fixtureDef.isSensor = false;
        this.body.createFixture(fixtureDef);

        var legsShape = planck.Circle(
            this.width / 2 / Settings.RATIO,
            planck.Vec2(0, -this.width / 2 / Settings.RATIO)
        );
        fixtureDef.shape = legsShape;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.isSensor = false;

        this.legs = this.body.createFixture(fixtureDef);

        // Create a fresh fixture definition for the foot sensor
        var footSensorDef = {
            shape: null,
            density: 0,
            friction: 0,
            restitution: 0,
            isSensor: true,
            userData: {
                onCollisionChange: this.onFootSensorDetection.bind(this),
                isFootSensor: true
            }
        };

        var feetShape = planck.Circle(
            (this.width - 1) / 2 / Settings.RATIO, // the -1 one prevents collisions with walls
            planck.Vec2(0, -20 / Settings.RATIO) // 20 pixels down from center (dramatic test)
        );
        footSensorDef.shape = feetShape;

        this.footSensor = this.body.createFixture(footSensorDef);

        var grabSensorLeftShape = planck.Box(
            this.reachDistance / 2 / Settings.RATIO,
            ((this.height / 2) + this.reachDistance / 4) / Settings.RATIO, 
            planck.Vec2(
                -this.reachDistance / 2 / Settings.RATIO, 
                -this.height / 2 / Settings.RATIO
            )
        );
        fixtureDef.shape = grabSensorLeftShape;
        fixtureDef.isSensor = true;
        fixtureDef.userData = {
            onCollisionChange: function(isColliding, fixture) {
                self.onFixtureWithinReach(isColliding, "left", fixture);
            }
        };
        this.body.createFixture(fixtureDef);

        var grabSensorRightShape = planck.Box(
            this.reachDistance / 2 / Settings.RATIO,
            ((this.height / 2) + this.reachDistance / 4) / Settings.RATIO, 
            planck.Vec2(
                this.reachDistance / 2 / Settings.RATIO, 
                -this.height / 2 / Settings.RATIO
            )
        );
        fixtureDef.shape = grabSensorRightShape;
        fixtureDef.isSensor = true;
        
        fixtureDef.userData = {
            onCollisionChange: function(isColliding, fixture) {
                self.onFixtureWithinReach(isColliding, "right", fixture);
            }
        };

        this.body.createFixture(fixtureDef);

        // Area Sensor
        var areaSensorShape = planck.Box(
            (this.width + this.areaSize) / 2 / Settings.RATIO,
            (this.height + this.areaSize) / 2 / Settings.RATIO, 
            planck.Vec2(
                0, 
                -this.height / 2 / Settings.RATIO
            )
        );
        fixtureDef.shape = areaSensorShape;
        fixtureDef.isSensor = true;
        
        fixtureDef.userData = {
            onCollisionChange: function(isColliding, fixture) {
                var userData = fixture.getBody().getUserData();
                if(userData instanceof Doll) {
                    var doll = userData;
                    var i = self.nearbyDolls.indexOf(doll);
                    if(isColliding) {
                        if(i === -1) {
                            self.nearbyDolls.push(doll);
                        }
                    } else {
                        if(i !== -1) {
                            self.nearbyDolls.splice(i, 1);
                        }
                    }
                } 
            }
        };

        this.body.createFixture(fixtureDef);
    };

    Doll.prototype.setActionState = function(state) {
        this.actionState = state;
    };

    Doll.prototype.getActionState = function() {
        return this.actionState;
    };

    Doll.prototype.isWalking = function() {
        return ["walk", "walkback", "run"].indexOf(this.actionState) >= 0;
    };

    Doll.prototype.spawn = function (x, y) {
        Assert.number(x, y);
        this.body.setPosition(planck.Vec2(x / Settings.RATIO, y / Settings.RATIO));
        this.body.setActive(true);
        this.setActionState("fall");
    };

    Doll.prototype.getHeadPosition = function() {
        var pos = this.body.getPosition();
        return {
            x: pos.x,
            y: pos.y - (this.height - this.headHeight / 2) / Settings.RATIO
        };
    };

    Doll.prototype.setFriction = function (friction) {
        if(!friction) friction = -1;

        Assert.number(friction);

        if (this.legs.getFriction() != friction) {
            this.legs.setFriction(friction);
        }
    };

    Doll.prototype.move = function (direction, modifierActivated) {

        this.moveDirection = direction;
        var speed;
        var isHoldingHeavyItem = this.holdingItem && this.holdingItem.options.weight > Settings.MAX_RUNNING_WEIGHT;
        
        switch(true) {
            case direction == this.lookDirection && this.isStanding() && !isHoldingHeavyItem && !modifierActivated:
                speed = Settings.RUN_SPEED;
                break;

            case !this.isStanding():
                speed = Settings.FLY_SPEED;
                
                if(isHoldingHeavyItem) {
                    if(Settings.FLY_SPEED > Settings.WALK_SPEED) {
                        speed = Settings.WALK_SPEED;
                    }
                }
                break;

            default:
                speed = Settings.WALK_SPEED;
                break;
        }

        this.setFriction(Settings.PLAYER_MOTION_FRICTION);
        this.body.setAwake(true);

        Assert.number(speed, direction);
        var vector = planck.Vec2(speed * direction, this.body.getLinearVelocity().y);
        this.body.setLinearVelocity(vector);

        if(this.isStanding()) {
            if(this.moveDirection == this.lookDirection) {

                if(isHoldingHeavyItem || modifierActivated) {
                    this.setActionState("walk");
                } else {
                    this.setActionState("run");
                }
            
            } else {
                this.setActionState("walkback");
            }
        }
    };

    Doll.prototype.stop = function () {
        this.moveDirection = 0;
        this.setFriction(Settings.PLAYER_FRICTION);
        if(this.isStanding()) {
            this.setActionState("stand");
        } else {
            var vector = this.body.getLinearVelocity().clone();
            vector.x *= Settings.JUMP_STOP_DAMPING_FACTOR;
            this.body.setLinearVelocity(vector);
        }
    };

    Doll.prototype.jump = function () {
        if (this.isStanding()) {
            
            this.body.setAwake(true);

            var vector = planck.Vec2(0, -Settings.JUMP_SPEED);
            this.body.setLinearVelocity(vector);
            
            this.setStanding(false);
            this.setActionState("jump");
        }
    };

    Doll.prototype.jumpStop = function () {
        if (!this.isStanding() ) {
            this.body.setAwake(true);
            var vector = this.body.getLinearVelocity().clone();
            if(vector.y < 0) {
                vector.y *= Settings.JUMP_STOP_DAMPING_FACTOR;
                this.body.setLinearVelocity(vector);
            }
        }
    };

    Doll.prototype.setStanding = function (isStanding) {
        if (this.standing == isStanding) {
            console.log('setStanding called but no change needed, already:', isStanding);
            return;
        }
        console.log('*** STANDING STATE CHANGE: ', this.standing, '->', isStanding, '***');
        this.standing = isStanding;
        if(isStanding) this.setActionState("stand");
    };

    Doll.prototype.isStanding = function () {
        return this.standing;
    };

    Doll.prototype.lookAt = function(x, y) {
        var oldLookDirection = this.lookDirection;

        this.body.setAwake(true);
        if(x < 0) {
            this.lookDirection = -1;
        } else {
            this.lookDirection = 1;
        }

        this.lookAtXY.x = x;
        this.lookAtXY.y = y;

        if(oldLookDirection != this.lookDirection) {
            this.positionHoldingItem();
        }
    };

    Doll.prototype.grab = function(item) {
        this.holdingItem = item;
        this.positionHoldingItem();
    };

    Doll.prototype.positionHoldingItem = function() {
        if(this.holdingItem) {

            if(this.holdingJoint) {
                this.body.getWorld().destroyJoint(this.holdingJoint);
                this.holdingJoint = null;
            }

            var bodyPosition = this.body.getPosition();

            Assert.number(this.width, this.height);
            Assert.number(this.lookDirection);
            var handPosition = planck.Vec2(
                bodyPosition.x + ((this.width / 2 / Settings.RATIO) * this.lookDirection),
                bodyPosition.y - this.height / 4 * 2 / Settings.RATIO // 2/3 of the body height
            );

            this.holdingItem.reposition(handPosition, this.lookDirection);

            var jointDef = new Box2D.Dynamics.Joints.b2WeldJointDef();
            jointDef.initialize(this.body, this.holdingItem.body, this.holdingItem.getGrabPoint());

            this.holdingJoint = this.body.getWorld().createJoint(jointDef);
        }
    };

    Doll.prototype.throw = function(item, options) {
        if(this.holdingJoint) {
            this.body.getWorld().destroyJoint(this.holdingJoint);
        } else {
            // log stack if we called throw without a holdingJoint
            var w = new Error("Throwing without a holdingJoint");
            console.error(w.message + "\n" + w.stack);
        }

        this.holdingJoint = null;
        this.holdingItem = null;

        var dollVelocity = {
            x: this.body.getLinearVelocity().x,
            y: this.body.getLinearVelocity().y
        };

        item.throw(options, dollVelocity);
    };

    Doll.prototype.isAnotherPlayerNearby = function() {
        return this.nearbyDolls.length > 0;
    };

    Doll.prototype.onFootSensorDetection = function(isColliding, fixture) {
        var self = this;

        var hasJumpStartVelocity = this.body.getLinearVelocity().y < -Settings.JUMP_SPEED;
        var currentVelocity = this.body.getLinearVelocity();

        if(isColliding) {
            if(!hasJumpStartVelocity) {
                this.setStanding(true);
            }
        } else {
            var contactCount = 0;

            var edge = self.body.getContactList();
            while (edge) {
                var contact = edge.contact;
                
                if(!contact.isTouching()) {
                    edge = edge.next;
                    continue;
                }
               
                if(contact.getFixtureA() === self.footSensor) {
                    contactCount++;
                }
                
                if(contact.getFixtureB() === self.footSensor) {
                    contactCount++;
                }

                edge = edge.next;
            }

            if (contactCount === 0) {
                self.setStanding(false);
            }
        }
    };

    Doll.prototype.onImpact = function(isColliding, fixture) { // jshint unused:false
        // overwrite if necessary
    };

    Doll.prototype.onFixtureWithinReach = function(isColliding, side, fixture) {
                        var item = fixture.getBody().getUserData();
        if (!(item instanceof Item)) return;

        if(isColliding) {

            this.reachableItems[side].push(item);

        } else {
            var i = this.reachableItems[side].indexOf(item);
            if (i >= 0) {
                this.reachableItems[side].splice(i, 1);
            }
        }
    };

    Doll.prototype.getVelocities = function() {
        return {
            linearVelocity: this.body.getLinearVelocity(),
            angularVelocity: this.body.getAngularVelocity()
        };
    };

    Doll.prototype.update = function() {
     
        if (this.body.getLinearVelocity().x === 0 && this.isWalking()) {
            this.stop();
        }

        if (!this.body.isAwake() && !this.isStanding()) {
            this.setStanding(true);
        }
    };

    Doll.prototype.setUpdateData = function(update) {

        Parent.prototype.setUpdateData.call(this, update);

        this.setActionState(update.as);
        this.lookAt(update.laxy.x, update.laxy.y);
    };

    Doll.prototype.destroy = function() {
        nc.trigger(nc.ns.core.game.worldUpdateObjects.remove, this);
        Parent.prototype.destroy.call(this);
    };

    return Doll;
});