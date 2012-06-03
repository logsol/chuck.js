Chuck.Physics.Doll = function(engine){
    this._engine = engine;
    this._body;
    this._legs;
    this._contactPoint;
    
    this.init(this._engine.getWorld());
}

Chuck.Physics.Doll.prototype.init = function (world) {

    var bodyDef = new Chuck.b2BodyDef();
    bodyDef.position.x = 220 / Chuck.Settings.RATIO;
    bodyDef.position.y = 0 / Chuck.Settings.RATIO;
    bodyDef.fixedRotation = true;
    bodyDef.linearDamping = Chuck.Settings.PLAYER_LINEAR_DAMPING;
    bodyDef.type = Chuck.b2Body.b2_dynamicBody;

    this._body = world.CreateBody(bodyDef);

    var fixtureDef = new Chuck.b2FixtureDef();
    fixtureDef.density = Chuck.Settings.PLAYER_DENSITY;
    fixtureDef.friction = 0;
    fixtureDef.restitution = Chuck.Settings.PLAYER_RESTITUTION;

    var headShape = new Chuck.b2CircleShape();
    headShape.SetRadius(5 / Chuck.Settings.RATIO);
    headShape.SetLocalPosition(new Chuck.b2Vec2(0 / Chuck.Settings.RATIO, -37 / Chuck.Settings.RATIO));
    fixtureDef.shape = headShape;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'myHead';
    this._body.CreateFixture(fixtureDef);

    var bodyShape = new Chuck.b2PolygonShape();
    bodyShape.SetAsOrientedBox(5 / Chuck.Settings.RATIO, 16 / Chuck.Settings.RATIO, new Chuck.b2Vec2(0 / Chuck.Settings.RATIO, -21 / Chuck.Settings.RATIO));
    fixtureDef.shape = bodyShape;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'myBody';
    this._body.CreateFixture(fixtureDef);

    var legsShape = new Chuck.b2CircleShape();
    legsShape.SetRadius(5 / Chuck.Settings.RATIO);
    legsShape.SetLocalPosition(new Chuck.b2Vec2(0 / Chuck.Settings.RATIO, -5 / Chuck.Settings.RATIO));
    fixtureDef.shape = legsShape;
    fixtureDef.friction = Chuck.Settings.PLAYER_FRICTION;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'myLegs';
    this._legs = this._body.CreateFixture(fixtureDef);

    var feetShape = new Chuck.b2CircleShape();
    feetShape.SetRadius(4 / Chuck.Settings.RATIO);
    feetShape.SetLocalPosition(new Chuck.b2Vec2(0 / Chuck.Settings.RATIO, 0 / Chuck.Settings.RATIO));
    fixtureDef.shape = feetShape;
    fixtureDef.isSensor = true;
    fixtureDef.userData = 'myFeet';
    this._body.CreateFixture(fixtureDef);

    this._body.SetActive(false);
}

Chuck.Physics.Doll.prototype.spawn = function (x, y) {
    this._body.SetPosition(new Chuck.b2Vec2(x / Chuck.Settings.RATIO, y / Chuck.Settings.RATIO));
    this._body.SetActive(true);
}

Chuck.Physics.Doll.prototype.getBody = function () {
    return this._body;
}

Chuck.Physics.Doll.prototype._setFriction = function (friction) {
    if(!friction) friction = -1;

    if (this._legs.GetFriction() != friction)
    {
        this._legs.SetFriction(friction);
    }
}

Chuck.Physics.Doll.prototype.move = function (direction, speed) {
    this._setFriction(Chuck.Settings.PLAYER_MOTION_FRICTION);
    this._body.SetAwake(true);
    var vector = new Chuck.b2Vec2(speed * direction, this._body.GetLinearVelocity().y);
    this._body.SetLinearVelocity(vector);
}

Chuck.Physics.Doll.prototype.stop = function () {
    this._setFriction(Chuck.Settings.PLAYER_FRICTION);
}

Chuck.Physics.Doll.prototype.jump = function () {
    this._body.SetAwake(true);

    var vector = new Chuck.b2Vec2(0, -Chuck.Settings.JUMP_SPEED);
    this._body.ApplyImpulse(vector, this._body.GetPosition());

    // maybe change to a constant force instead of applying of force?
    // to prevent higher jumping running uphill, etc.
}

Chuck.Physics.Doll.prototype.jumping = function () {
    var vector = new Chuck.b2Vec2(0, -0.1);
    this._body.ApplyImpulse(vector, this._body.GetPosition());
}

