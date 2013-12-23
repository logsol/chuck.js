define([
    "Game/" + GLOBALS.context + "/GameObjects/GameObject",
    "Lib/Vendor/Box2D", 
    "Game/Config/Settings", 
    "Game/" + GLOBALS.context + "/Collision/Detector"
], 

function (Parent, Box2D, Settings, CollisionDetector) {

    function Doll (physicsEngine, playerId) {

        Parent.call(this, physicsEngine);

        this.playerId = playerId;

        this.standing = false;
        this.moveDirection = 0;
        this.lookDirection = 0;
        this.legs;
        
        this.createFixtures();
        this.body.SetActive(false);
    }

    Doll.prototype = Object.create(Parent.prototype);

    Doll.prototype.getBodyDef = function() {
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.x = 220 / Settings.RATIO;
        bodyDef.position.y = 0 / Settings.RATIO;
        bodyDef.fixedRotation = true;
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.userData = CollisionDetector.IDENTIFIER.PLAYER + '-' + this.playerId;

        return bodyDef;
    };

    Doll.prototype.createFixtures = function () {

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = 0;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;

        var headShape = new Box2D.Collision.Shapes.b2CircleShape();
        headShape.SetRadius(5 / Settings.RATIO);
        headShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -37 / Settings.RATIO));
        fixtureDef.shape = headShape;
        fixtureDef.isSensor = false;
        this.body.CreateFixture(fixtureDef);

        var bodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
        bodyShape.SetAsOrientedBox(5 / Settings.RATIO, 16 / Settings.RATIO, new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -21 / Settings.RATIO));
        fixtureDef.shape = bodyShape;
        fixtureDef.isSensor = false;
        this.body.CreateFixture(fixtureDef);

        var legsShape = new Box2D.Collision.Shapes.b2CircleShape();
        legsShape.SetRadius(5 / Settings.RATIO);
        legsShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -5 / Settings.RATIO));
        fixtureDef.shape = legsShape;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.isSensor = false;

        this.legs = this.body.CreateFixture(fixtureDef);

        var feetShape = new Box2D.Collision.Shapes.b2CircleShape();
        feetShape.SetRadius(4 / Settings.RATIO);
        feetShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, 0 / Settings.RATIO));
        fixtureDef.shape = feetShape;
        fixtureDef.isSensor = true;

        fixtureDef.userData = {
            onCollisionChange: this.onFootSensorDetection.bind(this)
        }

        this.body.CreateFixture(fixtureDef);
    }

    Doll.prototype.spawn = function (x, y) {
        this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x / Settings.RATIO, y / Settings.RATIO));
        this.body.SetActive(true);
    }

    Doll.prototype.getPosition = function() {
        return this.body.GetPosition();
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
        
        switch(true) {
            case direction == this.lookDirection && this.isStanding():
                speed = Settings.RUN_SPEED;
                break;

            case !this.isStanding():
                speed = Settings.FLY_SPEED;
                break;

            default:
                speed = Settings.WALK_SPEED;
                break;
        }

        this.setFriction(Settings.PLAYER_MOTION_FRICTION);
        this.body.SetAwake(true);
        var vector = new Box2D.Common.Math.b2Vec2(speed * direction, this.body.GetLinearVelocity().y);
        this.body.SetLinearVelocity(vector);
    }

    Doll.prototype.stop = function () {
        this.moveDirection = 0;
        this.setFriction(Settings.PLAYER_FRICTION);
    }

    Doll.prototype.jump = function () {
        if (this.isStanding()) {
            
            this.body.SetAwake(true);
            var vector = new Box2D.Common.Math.b2Vec2(0, -Settings.JUMP_SPEED);
            this.body.ApplyImpulse(vector, this.body.GetPosition());
            
            this.setStanding(false);
        }
    }

    Doll.prototype.destroy = function () {
        this.body.GetWorld().DestroyBody(this.body);
    }

    Doll.prototype.setStanding = function (isStanding) {
        this.standing = isStanding;
    }

    Doll.prototype.isStanding = function () {
        return this.standing;
    }

    Doll.prototype.lookAt = function(x, y) {
        var lastLookDirection = this.lookDirection;
        /*
        var degree = Math.atan2(Settings.STAGE_WIDTH / 2 - x, Settings.STAGE_HEIGHT / 2 - 25 - y) / (Math.PI / 180);
        if (x < Settings.STAGE_WIDTH / 2) {
            this.mc.scaleX = -1;
            this.lookDirection = -1;
            degree = (-45 + degree / 2);
            this.mc.head.rotation = degree;
        } else if (x >= Settings.STAGE_WIDTH / 2) {
            this.mc.scaleX = 1;
            this.lookDirection = 1;
            degree = (45 + -degree / 2) - 90;
            this.mc.head.rotation = degree;
        }
        */

        if(x < 0) {
            this.lookDirection = -1;
        } else {
            this.lookDirection = 1;
        }
    };

    Doll.prototype.onFootSensorDetection = function(isColliding) {
        if(isColliding && !(this.body.GetLinearVelocity().y < -Settings.JUMP_SPEED && !this.isStanding())) {
            this.setStanding(true);
        }
    };

    Doll.prototype.update = function() {
     
        if (this.body.GetLinearVelocity().x == 0) {
            this.stop();
        }

        if (!this.body.IsAwake() && !this.isStanding()) {
            this.setStanding(true);
        }
    };

    return Doll;
});