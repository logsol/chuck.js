define([
    "Lib/Vendor/Box2D",
    "Lib/Utilities/Exception"
],
 
function (Box2D, Exception) {

	"use strict";
 
    function GameObject(physicsEngine, uid) {
        this.uid = uid;

        var def = this.getBodyDef();
        def.userData = this;
        this.body = physicsEngine.getWorld().CreateBody(def);
    }

    GameObject.prototype.getBodyDef = function() {
        throw new Exception('Abstract method GameObject.getBodyDef not overwritten');
    };

    GameObject.prototype.destroy = function() {
        if(this.body instanceof Box2D.Dynamics.b2Body) {
            this.body.GetWorld().DestroyBody(this.body);   
        } else {
            throw new Exception("can not destroy body");
        }
    };

    GameObject.prototype.getBody = function() {
    	return this.body;
    };

    GameObject.prototype.getPosition = function() {
        return this.body.GetPosition().Copy();
    };
 
    return GameObject;
 
});