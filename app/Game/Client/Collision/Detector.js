define([
    "Lib/Vendor/Box2D", 
    "Game/Core/Collision/Detector"
], 

function(Box2D, Parent) {

    function Detector(me) {
        Parent.call(this);
        this.me = me;
    }

    Detector.prototype = Object.create(Parent.prototype);

    Detector.prototype.handleStand = function(point, isColliding) {
        if (point.GetFixtureA().GetUserData() == Detector.IDENTIFIER.PLAYER_FOOT_SENSOR
         || point.GetFixtureB().GetUserData() == Detector.IDENTIFIER.PLAYER_FOOT_SENSOR)  {

            this.me.onFootSensorDetection(isColliding);
        }
    }

    return Detector;
});