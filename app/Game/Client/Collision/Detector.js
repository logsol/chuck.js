define([
    "Game/Core/Collision/Detector"
], 

function (Parent) {

	"use strict";

    function Detector () {
        Parent.call(this);
    }

    Detector.prototype = Object.create(Parent.prototype);

    return Detector;
});