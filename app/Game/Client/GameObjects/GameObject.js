define([
	"Game/Core/GameObjects/GameObject"
],
 
function(Parent) {
 
    function GameObject(physicsEngine, view) {
    	this.view = view;
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
    	throw new Exception('Abstract method GameObject.getMesh not overwritten');
    };
 
    return GameObject;
 
});