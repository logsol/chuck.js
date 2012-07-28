define(["Lib/Vendor/Box2D", "Game/Config/Settings", "Game/Core/Collision/Detector"], function (Box2D, Settings, CollisionDetector) {

    function Doll (physicsEngine, id){
        this.id = id;
        this.physicsEngine = physicsEngine;
        this.body;
        this.legs;
        this.contactPoint;
        
        this.init(this.physicsEngine.getWorld());
    }

    Doll.prototype.init = function (world) {

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.x = 220 / Settings.RATIO;
        bodyDef.position.y = 0 / Settings.RATIO;
        bodyDef.fixedRotation = true;
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.userData = CollisionDetector.IDENTIFIER.PLAYER + '-' + this.id;

        this.body = world.CreateBody(bodyDef);

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = 0;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;

        var headShape = new Box2D.Collision.Shapes.b2CircleShape();
        headShape.SetRadius(5 / Settings.RATIO);
        headShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -37 / Settings.RATIO));
        fixtureDef.shape = headShape;
        fixtureDef.isSensor = false;
        fixtureDef.userData = CollisionDetector.IDENTIFIER.PLAYER_HEAD;
        this.body.CreateFixture(fixtureDef);

        var bodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
        bodyShape.SetAsOrientedBox(5 / Settings.RATIO, 16 / Settings.RATIO, new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -21 / Settings.RATIO));
        fixtureDef.shape = bodyShape;
        fixtureDef.isSensor = false;
        fixtureDef.userData = CollisionDetector.IDENTIFIER.PLAYER_CHEST;
        this.body.CreateFixture(fixtureDef);

        var legsShape = new Box2D.Collision.Shapes.b2CircleShape();
        legsShape.SetRadius(5 / Settings.RATIO);
        legsShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -5 / Settings.RATIO));
        fixtureDef.shape = legsShape;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.isSensor = false;
        fixtureDef.userData = CollisionDetector.IDENTIFIER.PLAYER_LEGS;

        this.legs = this.body.CreateFixture(fixtureDef);

        var feetShape = new Box2D.Collision.Shapes.b2CircleShape();
        feetShape.SetRadius(4 / Settings.RATIO);
        feetShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, 0 / Settings.RATIO));
        fixtureDef.shape = feetShape;
        fixtureDef.isSensor = true;
        fixtureDef.userData = CollisionDetector.IDENTIFIER.FOOTSENSOR;
        this.body.CreateFixture(fixtureDef);

        this.body.SetActive(false);
    }

    Doll.prototype.spawn = function (x, y) {
        this.body.SetPosition(new Box2D.Common.Math.b2Vec2(x / Settings.RATIO, y / Settings.RATIO));
        this.body.SetActive(true);
    }

    Doll.prototype.getBody = function () {
        return this.body;
    }

    Doll.prototype.setFriction = function (friction) {
        if(!friction) friction = -1;

        if (this.legs.GetFriction() != friction) {
            this.legs.SetFriction(friction);
        }
    }

    Doll.prototype.move = function (direction, speed) {
        this.setFriction(Settings.PLAYER_MOTION_FRICTION);
        this.body.SetAwake(true);
        var vector = new Box2D.Common.Math.b2Vec2(speed * direction, this.body.GetLinearVelocity().y);
        this.body.SetLinearVelocity(vector);
    }

    Doll.prototype.stop = function () {
        this.setFriction(Settings.PLAYER_FRICTION);
    }

    Doll.prototype.jump = function () {
        this.body.SetAwake(true);

        var vector = new Box2D.Common.Math.b2Vec2(0, -Settings.JUMP_SPEED);
        this.body.ApplyImpulse(vector, this.body.GetPosition());

        // maybe change to a constant force instead of applying of force?
        // to prevent higher jumping running uphill, etc.
    }

    Doll.prototype.jumping = function () {
        var vector = new Box2D.Common.Math.b2Vec2(0, -0.05);
        this.body.ApplyImpulse(vector, this.body.GetPosition());
    }

    Doll.prototype.destroy = function () {
        this.body.GetWorld().DestroyBody(this.body);
    }

    return Doll;
});