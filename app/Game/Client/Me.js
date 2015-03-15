define([
	"Game/Client/Player",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert"
],
 
function (Parent, Settings, Nc, Assert) {

	"use strict";
 
    function Me(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);

        // View uses this to calculate center position
        this.lookAtXY = {
            x: Settings.VIEWPORT_LOOK_AHEAD,
            y: 0
        };

    	this.lastServerPositionState = {
    		p: {
    			x: 0,
    			y: 0
    		}
    	};

        this.arrowMesh = null;
        this.createAndAddArrow();
    }

    Me.prototype = Object.create(Parent.prototype);

    Me.prototype.lookAt = function(x, y) {
        this.lookAtXY = {
            x: x,
            y: y
        };

        Parent.prototype.lookAt.call(this, x, y);
    };

    Me.prototype.getLookAt = function() {
        return {
            x: this.lookAtXY.x,
            y: this.lookAtXY.y
        };
    };
 
    Me.prototype.setLastServerPositionState = function(update) {
    	this.lastServerPositionState = update;
    };

	Me.prototype.isPositionStateUpdateNeeded = function() {

		if(!this.doll) {
            return false;
        }

        if(this.doll.isAnotherPlayerNearby()) {
            return false;
        }

		var difference = {
			x: Math.abs(this.lastServerPositionState.p.x - this.doll.body.GetPosition().x),
			y: Math.abs(this.lastServerPositionState.p.y - this.doll.body.GetPosition().y)
		};

		if(difference.x > Settings.ME_STATE_MAX_DIFFERENCE_METERS ||
            difference.y > Settings.ME_STATE_MAX_DIFFERENCE_METERS) {
			return true;
		}
    	return false;
    };

    Me.prototype.getPositionStateUpdate = function() {
    	return {
    		p: this.doll.body.GetPosition().Copy(),
    		lv: this.doll.body.GetLinearVelocity().Copy()
    	};
    };

    Me.prototype.acceptPositionStateUpdateFromServer = function() {
        // gamecontroller should accept  me's doll update only when another players doll is nearby.
        return this.doll.isAnotherPlayerNearby();
    };

    Me.prototype.resetPositionState = function(options) {
        Assert.number(options.p.x, options.p.y);
        Assert.number(options.lv.x, options.lv.y);
        this.doll.body.SetPosition(options.p);
        this.doll.body.SetLinearVelocity(options.lv);
    };

    Me.prototype.createAndAddArrow = function() {
        var self = this;

        var position = this.getPosition();

        var options = {
            x: position.x * Settings.RATIO,
            y: position.y * Settings.RATIO,
        };

        var callback = function(arrowMesh) {
            self.arrowMesh = arrowMesh;
        };
        Nc.trigger(Nc.ns.client.view.playerArrow.createAndAdd, callback, options);
    };

    Me.prototype.render = function() {

        Parent.prototype.render.call(this);

        var position = this.getPosition();
        var options = {
            x: position.x * Settings.RATIO,
            y: position.y * Settings.RATIO,
        };
        Nc.trigger(Nc.ns.client.view.playerArrow.update, this.arrowMesh, options);
    };

    return Me;
});