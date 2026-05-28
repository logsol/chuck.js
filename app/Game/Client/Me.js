define([
	"Game/Client/Player",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Assert",
    "Game/Client/Control/PlayerController",
],

function (Parent, Settings, nc, Assert, PlayerController) {

	"use strict";
 
    function Me(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);

        // View uses this to calculate center position
        this.lookAtXY = {
            x: Settings.VIEWPORT_LOOK_AHEAD,
            y: 0
        };

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