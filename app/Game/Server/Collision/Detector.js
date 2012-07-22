define([
    "Lib/Vendor/Box2D", 
    "Game/Core/Collision/Detector"
], 

function(Box2D, Parent) {

    function Detector() {
        Parent.call(this);
    }

    Detector.prototype = Object.create(Parent.prototype);

    Detector.prototype.handleStand = function(point, isColliding) {
        throw "Implement this function";
    }

    return Detector;
});