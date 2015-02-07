define([
    "Game/" + GLOBALS.context + "/GameObjects/GameObject",
    "Lib/Vendor/Box2D"
], 
 
function (Parent, Box2D) {

	"use strict";
 
    function SpectatorDoll(physicsEngine, uid, player) {
    	//Parent.call(this, physicsEngine, uid);
    }

    SpectatorDoll.prototype = Object.create(Parent.prototype);

    SpectatorDoll.prototype.getBodyDef = function() {
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        bodyDef.position.x = this.getPosition().x;
        bodyDef.position.y = this.getPosition().y;
        bodyDef.angle = 0;

        return bodyDef;
    };

    SpectatorDoll.prototype.getPosition = function() {
        return {x: 10, y: 10};
    }
 
    SpectatorDoll.prototype.getHeadPosition = function() {
        return {x: 10, y: 10};
    }

    SpectatorDoll.prototype.update = function() {
    };

    SpectatorDoll.prototype.destroy = function() {
    };
 
    return SpectatorDoll;
 
});