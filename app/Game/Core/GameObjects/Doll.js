define([
    "Game/" + GLOBALS.context + "/GameObjects/GameObject",
    "Lib/Vendor/Box2D", 
    "Game/Config/Settings", 
    "Game/" + GLOBALS.context + "/Collision/Detector",
    "Game/" + GLOBALS.context + "/GameObjects/Item"
], 

function (Parent, Box2D, Settings, CollisionDetector, Item) {

    function Doll (physicsEngine, uid, player) {

        this.player = player;
        this.height = 43;
        this.width = 9;
        this.headHeight = 12;
        this.reachDistance = 20;

        Parent.call(this, physicsEngine, uid);

        this.standing = false;
        this.moveDirection = 0;
        this.lookDirection = 0;
        this.legs;
        this.actionState = null;
        this.lookAtXY = { x:0, y:0 };
        this.reachableItems = {
            left: [],
            right: []
        };
        this.holdingJoint = null;
        this.holdingItem = null;
        
        this.createFixtures();
        this.body.SetActive(false);
    }

    Doll.prototype = Object.create(Parent.prototype);

    Doll.prototype.getBodyDef = function() {
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.x = 0;
        bodyDef.position.y = 0;
        bodyDef.fixedRotation = true;
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        return bodyDef;
    };

    Doll.prototype.createFixtures = function () {
        var self = this;

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = 0;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;

        var headShape = new Box2D.Collision.Shapes.b2CircleShape();
        headShape.SetRadius(this.width / 2 / Settings.RATIO);
        headShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, -(this.height - (this.width / 2)) / Settings.RATIO));
        fixtureDef.shape = headShape;
        fixtureDef.isSensor = false;
        fixtureDef.userData = {
            onCollisionChange: this.onImpact.bind(this)
        }

        this.body.CreateFixture(fixtureDef);

        var bodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
        bodyShape.SetAsOrientedBox(
            this.width / 2 / Settings.RATIO, 
            (this.height - this.width) / 2 / Settings.RATIO, 
            new Box2D.Common.Math.b2Vec2(0, -this.height / 2 / Settings.RATIO)
        );
        fixtureDef.shape = bodyShape;
        fixtureDef.isSensor = false;
        this.body.CreateFixture(fixtureDef);

        var legsShape = new Box2D.Collision.Shapes.b2CircleShape();
        legsShape.SetRadius(this.width / 2 / Settings.RATIO);
        legsShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, -this.width / 2 / Settings.RATIO));
        fixtureDef.shape = legsShape;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.isSensor = false;

        this.legs = this.body.CreateFixture(fixtureDef);

        fixtureDef.density = 0;

        var feetShape = new Box2D.Collision.Shapes.b2CircleShape();
        feetShape.SetRadius((this.width - 1) / 2 / Settings.RATIO); // the -1 one prevents collisions with walls
        feetShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0, 2 / Settings.RATIO)); // 2 is offset into ground
        fixtureDef.shape = feetShape;
        fixtureDef.isSensor = true;

        fixtureDef.userData = {
            onCollisionChange: this.onFootSensorDetection.bind(this)
        }

        this.body.CreateFixture(fixtureDef);

        var grabSensorLeftShape = new Box2D.Collision.Shapes.b2PolygonShape();
        grabSensorLeftShape.SetAsOrientedBox(
            this.reachDistance / 2 / Settings.RATIO,
            ((this.height / 2) + this.reachDistance / 4) / Settings.RATIO, 
            new Box2D.Common.Math.b2Vec2(
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
        }
        this.body.CreateFixture(fixtureDef);

        var grabSensorRightShape = new Box2D.Collision.Shapes.b2PolygonShape();
        grabSensorRightShape.SetAsOrientedBox(
            this.reachDistance / 2 / Settings.RATIO,
            ((this.height / 2) + this.reachDistance / 4) / Settings.RATIO, 
            new Box2D.Common.Math.b2Vec2(
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
        }

        this.body.CreateFixture(fixtureDef);
    }

    Doll.prototype.setActionState = function(state) {
        this.actionState = state;
    }

    Doll.prototype.getActionState = function() {
        return this.actionState;
    }

    Doll.prototype.isWalking = function() {
        return ["walk", "walkback", "run"].indexOf(this.actionState) >= 0;
    }

    Doll.prototype.spawn = function (x, y) {
        this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x / Settings.RATIO, y / Settings.RATIO));
        this.body.SetActive(true);
        this.setActionState("fall");
    }

    Doll.prototype.getPosition = function() {
        var pos = this.body.GetPosition();
        return {
            x: pos.x,
            y: pos.y
        };
    };

    Doll.prototype.getHeadPosition = function() {
        var pos = this.body.GetPosition();
        return {
            x: pos.x,
            y: pos.y - (this.height - this.headHeight / 2) / Settings.RATIO
        };
    };

    Doll.prototype.setFriction = function (friction) {
        if(!friction) friction = -1;

        if (this.legs.GetFriction() != friction) {
            this.legs.SetFriction(friction);
        }
    }

    Doll.prototype.move = function (direction) {

        this.moveDirection = direction;
        var speed;
        var isHoldingHeavyItem = this.holdingItem && this.holdingItem.options.weight > Settings.MAX_RUNNING_WEIGHT;
        
        switch(true) {
            case direction == this.lookDirection && this.isStanding() && !isHoldingHeavyItem:
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
        this.body.SetAwake(true);
        var vector = new Box2D.Common.Math.b2Vec2(speed * direction, this.body.GetLinearVelocity().y);
        this.body.SetLinearVelocity(vector);

        if(this.isStanding()) {
            if(this.moveDirection == this.lookDirection) {

                if(isHoldingHeavyItem) {
                    this.setActionState("walk");
                } else {
                    this.setActionState("run");
                }
            
            } else {
                this.setActionState("walkback");
            }
        }
    }

    Doll.prototype.stop = function () {
        this.moveDirection = 0;
        this.setFriction(Settings.PLAYER_FRICTION);
        if(this.isStanding()) this.setActionState("stand");
    }

    Doll.prototype.jump = function () {
        if (this.isStanding()) {
            
            this.body.SetAwake(true);
            var vector = new Box2D.Common.Math.b2Vec2(0, -Settings.JUMP_SPEED);
            this.body.SetLinearVelocity(vector);
            
            this.setStanding(false);

            this.setActionState("jump");
        }
    }

    Doll.prototype.setStanding = function (isStanding) {
        if (this.standing == isStanding) return;
        this.standing = isStanding;
        if(isStanding) this.setActionState("stand");
    }

    Doll.prototype.isStanding = function () {
        return this.standing;
    }

    Doll.prototype.lookAt = function(x, y) {
        var oldLookDirection = this.lookDirection;

        this.body.SetAwake(true);
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
                this.body.GetWorld().DestroyJoint(this.holdingJoint);
                this.holdingJoint = null;
            }

            var p = this.body.GetPosition();
            this.holdingItem.body.SetPosition(new Box2D.Common.Math.b2Vec2(
                p.x + ((this.holdingItem.options.width / Settings.RATIO / 2 + this.width / 2 / Settings.RATIO) * this.lookDirection),
                p.y - 1 // 1m in the air
            ));
            this.holdingItem.flip(this.lookDirection);
            this.holdingItem.body.SetAngle((this.holdingItem.options.grabAngle || 0) * this.lookDirection);

            var jointDef = new Box2D.Dynamics.Joints.b2WeldJointDef();
            jointDef.Initialize(this.body, this.holdingItem.body, this.holdingItem.body.GetWorldCenter());

            this.holdingJoint = this.body.GetWorld().CreateJoint(jointDef);
        }
    };

    Doll.prototype.throw = function(item, x, y) {
        this.body.GetWorld().DestroyJoint(this.holdingJoint);
        this.holdingJoint = null;
        this.holdingItem = null;

        var body = item.body;
        body.SetAwake(true);
        
        body.ApplyImpulse(
            new Box2D.Common.Math.b2Vec2(
                x * Settings.MAX_THROW_FORCE,
                -y * Settings.MAX_THROW_FORCE * 1.5 // 1.5 is to throw higher then far
            ),
            body.GetLocalCenter()
        );
        body.SetAngularVelocity(Settings.MAX_THROW_ANGULAR_VELOCITY * x); // 
    };

    Doll.prototype.onFootSensorDetection = function(isColliding, fixture) {

        var hasJumpStartVelocity = this.body.GetLinearVelocity().y < -Settings.JUMP_SPEED;

        if(isColliding && !hasJumpStartVelocity) {
            this.setStanding(true);
        }
    }

    Doll.prototype.onImpact = function(isColliding, fixture) {
        // overwrite if necessary
    };

    Doll.prototype.onFixtureWithinReach = function(isColliding, side, fixture) {
        var item = fixture.GetBody().GetUserData();
        if (!(item instanceof Item)) return;

        if(isColliding) {

            this.reachableItems[side].push(item);

        } else {
            var i = this.reachableItems[side].indexOf(item);
            if (i >= 0) {
                this.reachableItems[side].splice(i, 1);
            }
        }
    }

    Doll.prototype.update = function() {
     
        if (this.body.GetLinearVelocity().x == 0 && this.isWalking()) {
            this.stop();
        }

        if (!this.body.IsAwake() && !this.isStanding()) {
            this.setStanding(true);
        }
    };

    return Doll;
});