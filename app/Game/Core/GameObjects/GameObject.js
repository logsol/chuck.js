define([
    "Lib/Vendor/Box2D",
    "Lib/Utilities/Exception",
    "Lib/Utilities/Assert",
    "Lib/Utilities/NotificationCenter"
],
 
function (Box2D, Exception, Assert, nc) {

	"use strict";
 
    function GameObject(physicsEngine, uid) {
        this.uid = uid;

        var def = this.getBodyDef();
        def.userData = this;
        this.body = physicsEngine.createBody(def);

        this.ncTokens = (this.ncTokens || []).concat([
            nc.on(nc.ns.client.game.events.destroy, this.destroy, this)
        ]);
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

        nc.off(this.ncTokens);
    };

    GameObject.prototype.getBody = function() {
    	return this.body;
    };

    GameObject.prototype.getPosition = function() {
        return this.body.GetPosition().Copy();
    };

    GameObject.prototype.setUpdateData = function(update) {

        Assert.number(update.p.x, update.p.y);
        Assert.number(update.a);
        Assert.number(update.lv.x, update.lv.y);
        Assert.number(update.av);

        this.body.SetAwake(true);
        this.body.SetPosition(update.p);
        this.body.SetAngle(update.a);
        this.body.SetLinearVelocity(update.lv);
        this.body.SetAngularVelocity(update.av);
    };
 
    return GameObject;
 
});