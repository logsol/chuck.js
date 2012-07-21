define([
	"Lib/Vendor/Box2D", 
	"Game/Core/Collision/Detector"
], 

function(Box2D, Parent) {

	function Detector(me) {
		Parent.call(this);
		this.me = me;
    
	    this.listener = new Box2D.Dynamics.b2ContactListener();
	    this.listener.chuckDetector = this;
	    this.listener.BeginContact = this.BeginContact;
	    this.listener.PostSolve = this.PostSolve;
	    this.listener.EndContact = this.EndContact;
	}

	Detector.prototype = Object.create(Parent);

	Detector.prototype.getListener = function() {
	    return this.listener;
	}

	Detector.prototype.handleStand = function(point, isColliding) {
	    if (point.GetFixtureA().GetUserData() == Detector.IDENTIFIER.PLAYER_FOOT_SENSOR
	     || point.GetFixtureB().GetUserData() == Detector.IDENTIFIER.PLAYER_FOOT_SENSOR)  {

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