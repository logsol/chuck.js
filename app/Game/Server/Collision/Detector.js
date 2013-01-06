define([
    "Lib/Vendor/Box2D", 
    "Game/Core/Collision/Detector"
], 

function (Box2D, Parent) {

    function Detector (player) {
        Parent.call(this, player);
    }

    Detector.prototype = Object.create(Parent.prototype);

    return Detector;
});