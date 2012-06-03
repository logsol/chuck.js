Chuck.Collision.Detector = function(me) { //extends b2ContactListener {
    this._me = me;
    
    this._listener = new Chuck.b2ContactListener();
    this._listener._chuckDetector = this;
    this._listener.BeginContact = this.BeginContact;
    this._listener.PostSolve = this.PostSolve;
    this._listener.EndContact = this.EndContact;
}

Chuck.Collision.Detector.prototype.getListener = function() {
    return this._listener;
}

Chuck.Collision.Detector.prototype.handleStand = function(point, isColliding) {
    if (point.GetFixtureA().GetUserData() == 'myFeet' || point.GetFixtureB().GetUserData() == 'myFeet')  {
        this._me.onFootSensorDetection(isColliding);
    }
}

/** Extension **/

Chuck.Collision.Detector.prototype.BeginContact = function(point) {
    this._chuckDetector.handleStand(point, true);
}

Chuck.Collision.Detector.prototype.PostSolve = function(point, impulse) {
    this._chuckDetector.handleStand(point, true);
}

Chuck.Collision.Detector.prototype.EndContact = function(point) {
    this._chuckDetector.handleStand(point, false);
}
