define([
    "Game/Core/Collision/Detector",
    "Lib/Vendor/Box2D"
], 

function (Parent, Box2D) {

    function Detector (player) {
        Parent.call(this, player);
    }

    Detector.prototype = Object.create(Parent.prototype);

    return Detector;
});