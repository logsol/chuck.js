Game.Physics.Doll = function(world){
    this._body;
    this._legs;
    this._contactPoint;
    
    this.init(world);
}

Game.Physics.Doll.prototype.init = function (world) {

    var bodyDef = new Game.b2BodyDef();
    bodyDef.position.x = 220 / Game.Settings.RATIO;
    bodyDef.position.y = 0 / Game.Settings.RATIO;
    bodyDef.fixedRotation = true;
    bodyDef.linearDamping = Game.Settings.PLAYER_LINEAR_DAMPING;
    bodyDef.type = Game.b2Body.b2_dynamicBody;

    this._body = world.CreateBody(bodyDef);

    var fixtureDef = new Game.b2FixtureDef();
    fixtureDef.density = Game.Settings.PLAYER_DENSITY;
    fixtureDef.friction = 0;
    fixtureDef.restitution = Game.Settings.PLAYER_RESTITUTION;

    var headShape = new Game.b2CircleShape();
    headShape.SetRadius(5 / Game.Settings.RATIO);
    headShape.SetLocalPosition(new Game.b2Vec2(0 / Game.Settings.RATIO, -37 / Game.Settings.RATIO));
    fixtureDef.shape = headShape;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'myHead';
    this._body.CreateFixture(fixtureDef);

    var bodyShape = new Game.b2PolygonShape();
    bodyShape.SetAsOrientedBox(5 / Game.Settings.RATIO, 16 / Game.Settings.RATIO, new Game.b2Vec2(0 / Game.Settings.RATIO, -21 / Game.Settings.RATIO));
    fixtureDef.shape = bodyShape;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'myBody';
    this._body.CreateFixture(fixtureDef);

    var legsShape = new Game.b2CircleShape();
    legsShape.SetRadius(5 / Game.Settings.RATIO);
    legsShape.SetLocalPosition(new Game.b2Vec2(0 / Game.Settings.RATIO, -5 / Game.Settings.RATIO));
    fixtureDef.shape = legsShape;
    fixtureDef.friction = Game.Settings.PLAYER_FRICTION;
    fixtureDef.isSensor = false;
    fixtureDef.userData = 'myLegs';
    this._legs = this._body.CreateFixture(fixtureDef);

    var feetShape = new Game.b2CircleShape();
    feetShape.SetRadius(4 / Game.Settings.RATIO);
    feetShape.SetLocalPosition(new Game.b2Vec2(0 / Game.Settings.RATIO, 0 / Game.Settings.RATIO));
    fixtureDef.shape = feetShape;
    fixtureDef.isSensor = true;
    fixtureDef.userData = 'myFeet';
    this._body.CreateFixture(fixtureDef);

    this._body.SetActive(false);
}

Game.Physics.Doll.prototype.spawn = function (x, y) {
    this._body.SetPosition(new Game.b2Vec2(x / Game.Settings.RATIO, y / Game.Settings.RATIO));
    this._body.SetActive(true);
}

Game.Physics.Doll.prototype.getBody = function () {
    return this._body;
}

Game.Physics.Doll.prototype._setFriction = function (friction) {
    if(!friction) friction = -1;

    if (this._legs.GetFriction() != friction)
    {
        this._legs.SetFriction(friction);
    }
}

Game.Physics.Doll.prototype.move = function (direction, speed) {
    this._setFriction(Game.Settings.PLAYER_MOTION_FRICTION);
    this._body.SetAwake(true);
    var vector = new Game.b2Vec2(speed * direction, this._body.GetLinearVelocity().y);
    this._body.SetLinearVelocity(vector);
}

Game.Physics.Doll.prototype.stop = function () {
    this._setFriction(Game.Settings.PLAYER_FRICTION);
}

Game.Physics.Doll.prototype.jump = function () {
    this._body.SetAwake(true);

    var vector = new Game.b2Vec2(0, -Game.Settings.JUMP_SPEED);
    this._body.ApplyImpulse(vector, this._body.GetPosition());

    // maybe change to a constant force instead of applying of force?
    // to prevent higher jumping running uphill, etc.
}

Game.Physics.Doll.prototype.jumping = function () {
    var vector = new Game.b2Vec2(0, -0.1);
    this._body.ApplyImpulse(vector, this._body.GetPosition());
}

