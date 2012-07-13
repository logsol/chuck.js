define(["Vendor/Box2D", "Chuck/Settings"], function(Box2D, Settings){

    function Doll (physicsEngine, id){
        this.id = id;
        this._physicsEngine = physicsEngine;
        this._body;
        this._legs;
        this._contactPoint;
        
        this.init(this._physicsEngine.getWorld());
    }

    Doll.prototype.init = function (world) {

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position.x = 220 / Settings.RATIO;
        bodyDef.position.y = 0 / Settings.RATIO;
        bodyDef.fixedRotation = true;
        bodyDef.linearDamping = Settings.PLAYER_LINEAR_DAMPING;
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

        this._body = world.CreateBody(bodyDef);

        var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
        fixtureDef.density = Settings.PLAYER_DENSITY;
        fixtureDef.friction = 0;
        fixtureDef.restitution = Settings.PLAYER_RESTITUTION;

        var headShape = new Box2D.Collision.Shapes.b2CircleShape();
        headShape.SetRadius(5 / Settings.RATIO);
        headShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -37 / Settings.RATIO));
        fixtureDef.shape = headShape;
        fixtureDef.isSensor = false;
        fixtureDef.userData = 'myHead' + this.id;
        this._body.CreateFixture(fixtureDef);

        var bodyShape = new Box2D.Collision.Shapes.b2PolygonShape();
        bodyShape.SetAsOrientedBox(5 / Settings.RATIO, 16 / Settings.RATIO, new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -21 / Settings.RATIO));
        fixtureDef.shape = bodyShape;
        fixtureDef.isSensor = false;
        fixtureDef.userData = 'myBody' + this.id;
        this._body.CreateFixture(fixtureDef);

        var legsShape = new Box2D.Collision.Shapes.b2CircleShape();
        legsShape.SetRadius(5 / Settings.RATIO);
        legsShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, -5 / Settings.RATIO));
        fixtureDef.shape = legsShape;
        fixtureDef.friction = Settings.PLAYER_FRICTION;
        fixtureDef.isSensor = false;
        fixtureDef.userData = 'myLegs' + this.id;
        this._legs = this._body.CreateFixture(fixtureDef);

        var feetShape = new Box2D.Collision.Shapes.b2CircleShape();
        feetShape.SetRadius(4 / Settings.RATIO);
        feetShape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(0 / Settings.RATIO, 0 / Settings.RATIO));
        fixtureDef.shape = feetShape;
        fixtureDef.isSensor = true;
        fixtureDef.userData = 'myFeet' + this.id;
        this._body.CreateFixture(fixtureDef);

        this._body.SetActive(false);
    }

    Doll.prototype.spawn = function (x, y) {
        this._body.SetPosition(new Box2D.Common.Math.b2Vec2(x / Settings.RATIO, y / Settings.RATIO));
        this._body.SetActive(true);
    }

    Doll.prototype.getBody = function () {
        return this._body;
    }

    Doll.prototype._setFriction = function (friction) {
        if(!friction) friction = -1;

        if (this._legs.GetFriction() != friction)
        {
            this._legs.SetFriction(friction);
        }
    }

    Doll.prototype.move = function (direction, speed) {
        this._setFriction(Settings.PLAYER_MOTION_FRICTION);
        this._body.SetAwake(true);
        var vector = new Box2D.Common.Math.b2Vec2(speed * direction, this._body.GetLinearVelocity().y);
        this._body.SetLinearVelocity(vector);
    }

    Doll.prototype.stop = function () {
        this._setFriction(Settings.PLAYER_FRICTION);
    }

    Doll.prototype.jump = function () {
        this._body.SetAwake(true);

        var vector = new Box2D.Common.Math.b2Vec2(0, -Settings.JUMP_SPEED);
        this._body.ApplyImpulse(vector, this._body.GetPosition());

        // maybe change to a constant force instead of applying of force?
        // to prevent higher jumping running uphill, etc.
    }

    Doll.prototype.jumping = function () {
        var vector = new Box2D.Common.Math.b2Vec2(0, -0.05);
        this._body.ApplyImpulse(vector, this._body.GetPosition());
    }

    return Doll;
});