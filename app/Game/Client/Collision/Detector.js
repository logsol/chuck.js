define([
    "Game/Core/Collision/Detector"
], 

function (Parent) {

    function Detector (player) {
        Parent.call(this, player);
    }

    Detector.prototype = Object.create(Parent.prototype);

    Detector.IDENTIFIER = Parent.IDENTIFIER; // Needed because otherwise it will not be
    										 // inherited because it is not in prototype

    return Detector;
});