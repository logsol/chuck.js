define([
    "Lib/Vendor/Box2D"
],

function (Box2D) {

    function Detector () { // FIXME evtl.bind(this) ?
        this.listener = new Box2D.Dynamics.b2ContactListener();
        this.listener.chuckDetector = this;
        this.listener.BeginContact = this.BeginContact;
        //this.listener.PostSolve = this.PostSolve;
        this.listener.EndContact = this.EndContact;
    }

    Detector.IDENTIFIER = {
        TILE: "tile",
        PLAYER: "player"
    }

    Detector.prototype.getListener = function () {
        return this.listener;
    }

    Detector.prototype.onCollisionChange = function (point, isColliding) {
        var userDataA = point.GetFixtureA().GetUserData();
        var userDataB = point.GetFixtureB().GetUserData();

        if (userDataA && userDataA.onCollisionChange) {
            userDataA.onCollisionChange(isColliding, point.GetFixtureB());
        } else if (userDataB && userDataB.onCollisionChange) {
            userDataB.onCollisionChange(isColliding, point.GetFixtureA());
        }
    }

    /** Extension **/

    Detector.prototype.BeginContact = function (point) {
        this.chuckDetector.onCollisionChange(point, true);
    }

    Detector.prototype.PostSolve = function (point, impulse) {
    }

    Detector.prototype.EndContact = function (point) {
        this.chuckDetector.onCollisionChange(point, false);
    }

    return Detector;
});