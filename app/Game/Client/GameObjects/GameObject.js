define([
	"Game/Core/GameObjects/GameObject",
    "Lib/Utilities/Exception",
    "Lib/Utilities/NotificationCenter"
],
 
function (Parent, Exception, Nc) {

	"use strict";
 
    function GameObject(physicsEngine, uid) {
    	Parent.call(this, physicsEngine, uid);
    	this.createMesh();
    	this.render();
    }

    GameObject.prototype = Object.create(Parent.prototype);

    GameObject.prototype.destroy = function() {
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