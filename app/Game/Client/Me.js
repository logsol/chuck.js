define([
	"Game/Client/Player",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert",
    "Game/Client/Control/PlayerController",
    "Game/Client/InputBuffer",
],

function (Parent, Settings, nc, Assert, PlayerController, InputBuffer) {

	"use strict";
 
    function Me(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);

        // View uses this to calculate center position
        this.lookAtXY = {
            x: Settings.VIEWPORT_LOOK_AHEAD,
            y: 0
        };

        this.inputBuffer = new InputBuffer();

        this.arrowMesh = null;
        this.createAndAddArrow();
        this.playerController = new PlayerController(this);
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
 
    Me.prototype.applyReconciliation = function(x, y, vx, vy) {
        var currentPos = this.doll.body.GetPosition();
        var diffX = x - currentPos.x;
        var diffY = y - currentPos.y;
        var distance = Math.sqrt(diffX * diffX + diffY * diffY);

        if (distance > Settings.RECONCILIATION_SNAP_THRESHOLD) {
            // Large error — snap immediately (server-side teleport, respawn, etc.)
            this.doll.body.SetPosition({x: x, y: y});
        } else {
            // Small error — blend toward reconciled position
            var factor = Settings.RECONCILIATION_BLEND_FACTOR;
            this.doll.body.SetPosition({
                x: currentPos.x + diffX * factor,
                y: currentPos.y + diffY * factor
            });
        }

        this.doll.body.SetLinearVelocity({x: vx, y: vy});
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
        nc.trigger(nc.ns.client.view.playerArrow.createAndAdd, callback, options);
    };

    Me.prototype.render = function() {

        Parent.prototype.render.call(this);

        var position = this.getPosition();
        var options = {
            x: position.x * Settings.RATIO,
            y: position.y * Settings.RATIO,
        };
        nc.trigger(nc.ns.client.view.playerArrow.update, this.arrowMesh, options);
    };

    return Me;
});