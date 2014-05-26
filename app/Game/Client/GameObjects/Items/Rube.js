define([
	"Game/Core/GameObjects/Items/Rube"
],
 
function (Parent) {
 
    function Rube(physicsEngine, uid, options) {
    	Parent.call(this, physicsEngine, uid, options);
    }

    Rube.prototype = Object.create(Parent.prototype);
 
    Rube.prototype.createMesh = function() {
    };

    Rube.prototype.destroy = function() {
    };

    Rube.prototype.render = function() {
    }

    Rube.prototype.flip = function(direction) {
    };

    return Rube;
});