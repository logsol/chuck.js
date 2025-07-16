define([
    "Game/Core/GameObjects/GameObject",
    "Lib/Vendor/Planck"
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

        if (this.body.getType() === 'static') {
            return null;
        }

        if (!getSleeping && !this.body.isAwake()) {
            return null;
        }
        
        return {
                            p: this.body.getPosition(),
                            a: this.body.getAngle(),
                            lv: this.body.getLinearVelocity(),
            av: this.body.getAngularVelocity()
        };
    }
 
    return GameObject;
});