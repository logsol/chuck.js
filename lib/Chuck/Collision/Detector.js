define(["Vendor/Box2D"], function(Box2D) {

	function Detector(me) {
		this.me = me;
    
	    this.listener = new Box2D.Dynamics.b2ContactListener();
	    this.listener.chuckDetector = this;
	    this.listener.BeginContact = this.BeginContact;
	    this.listener.PostSolve = this.PostSolve;
	    this.listener.EndContact = this.EndContact;
	}

	Detector.prototype.getListener = function() {
	    return this.listener;
	}

	Detector.prototype.handleStand = function(point, isColliding) {
	    if (point.GetFixtureA().GetUserData() == 'myFeet' || point.GetFixtureB().GetUserData() == 'myFeet')  {
	        this.me.onFootSensorDetection(isColliding);
	    }
	}

	/** Extension **/

	Detector.prototype.BeginContact = function(point) {
	    this.chuckDetector.handleStand(point, true);
	}

	Detector.prototype.PostSolve = function(point, impulse) {
	    this.chuckDetector.handleStand(point, true);
	}

	Detector.prototype.EndContact = function(point) {
	    this.chuckDetector.handleStand(point, false);
	}

	return Detector;
});