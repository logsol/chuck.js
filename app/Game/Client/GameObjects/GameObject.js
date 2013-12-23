define([
	"Game/Core/GameObjects/GameObject",
    "Lib/Utilities/Exception"
],
 
function (Parent, Exception) {
 
    function GameObject(physicsEngine) {
    	Parent.call(this, physicsEngine);
    	this.createMesh();
    	this.render();
    }

    GameObject.prototype = Object.create(Parent.prototype);

    GameObject.prototype.destroy = function() {
    	// view ...
    	Parent.prototype.destroy.call(this);
    };
 
    GameObject.prototype.render = function() {
        throw new Exception('Abstract method GameObject.render not overwritten');
    }

    GameObject.prototype.createMesh = function() {
    	throw new Exception('Abstract method GameObject.createMesh not overwritten');
    };
 
    return GameObject;
 
});