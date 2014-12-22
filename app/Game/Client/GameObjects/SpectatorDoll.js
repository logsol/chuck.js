define([
	"Game/Core/GameObjects/SpectatorDoll"
],
 
function (Parent) {

	"use strict";
 
    function SpectatorDoll(physicsEngine, uid) {
    	Parent.call(this, physicsEngine, uid);
    }

    SpectatorDoll.prototype = Object.create(Parent.prototype);
 
    SpectatorDoll.prototype.render = function() {
        // warning is not being called yet!
    }

    SpectatorDoll.prototype.createMesh = function() {
    }
 
    return SpectatorDoll;
});