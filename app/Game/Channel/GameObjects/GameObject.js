define([
    "Game/Core/GameObjects/GameObject",
    "Lib/Vendor/Box2D"
],
 
function (Parent, Box2D) {

    "use strict";
 
    function GameObject(physicsEngine, uid) {
        Parent.call(this, physicsEngine, uid);
    }

    GameObject.prototype = Object.create(Parent.prototype);
 
    GameObject.prototype.getUpdateData = function(getSleeping) {

        if (!this.body) {
            return null;
        }

        if (this.body.GetType() === Box2D.Dynamics.b2Body.b2_staticBody) {
            return null;
        }

        if (!getSleeping && !this.body.IsAwake()) {
            return null;
        }
        
        return {
            p: this.body.GetPosition(),
            a: this.body.GetAngle(),
            lv: this.body.GetLinearVelocity(),
            av: this.body.GetAngularVelocity()
        };
    }
 
    return GameObject;
});