define([
    "Lib/Vendor/Box2D", 
    "Game/Core/Collision/Detector"
],

function (Box2D, Parent) {

    function Detector (player) { // FIXME evtl.bind(this) ?
        this.listener = new Box2D.Dynamics.b2ContactListener();
        this.listener.chuckDetector = this;
        this.listener.BeginContact = this.BeginContact;
        this.listener.PostSolve = this.PostSolve;
        this.listener.EndContact = this.EndContact;

        this.player = player;
    }

    Detector.IDENTIFIER = {
        TILE: "tile",
        PLAYER: "player",
        PLAYER_HEAD: 'head',
        PLAYER_CHEST: 'chest',
        PLAYER_LEGS: 'legs',
        PLAYER_FOOT_SENSOR: 'footsensor'
    }

    Detector.prototype.getListener = function () {
        return this.listener;
    }

    Detector.prototype.handleStand = function (point, isColliding) {

        if (point.GetFixtureA().GetUserData() == Detector.IDENTIFIER.PLAYER_FOOT_SENSOR + '-' + this.player.id
         || point.GetFixtureB().GetUserData() == Detector.IDENTIFIER.PLAYER_FOOT_SENSOR + '-' + this.player.id)  {

            this.player.onFootSensorDetection(isColliding);
        }
    }

    /** Extension **/

    Detector.prototype.BeginContact = function (point) {
        this.chuckDetector.handleStand(point, true);
    }

    Detector.prototype.PostSolve = function (point, impulse) {
        this.chuckDetector.handleStand(point, true);
    }

    Detector.prototype.EndContact = function (point) {
        this.chuckDetector.handleStand(point, false);
    }

    return Detector;
});