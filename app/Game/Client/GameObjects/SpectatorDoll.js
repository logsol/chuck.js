define([
	"Game/Core/GameObjects/SpectatorDoll"
],
 
function (Parent) {
 
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