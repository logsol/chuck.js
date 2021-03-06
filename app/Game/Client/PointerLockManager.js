define([
	"Lib/Utilities/QuerySelector", 
    "Lib/Utilities/NotificationCenter"
], 

function (qs, nc) {

    "use strict";
 
    function PointerLockManager() {
        this.canvas = qs.$("#canvas");

        this.listeners = [];

        if (!document) {
			throw new Error("Using PointerLockManager, but window.document is not defined.");
		}

        document.addEventListener('pointerlockchange', this.update.bind(this), false);
    	document.addEventListener('mozpointerlockchange', this.update.bind(this), false);
    	document.addEventListener('webkitpointerlockchange', this.update.bind(this), false);

        this.ncTokens = [
            nc.on(nc.ns.client.pointerLock.request, this.request, this)
        ];
    }
 
    PointerLockManager.prototype.request = function() {
		
        var canvas = this.canvas;

		canvas.requestPointerLock = canvas.requestPointerLock ||
                canvas.mozRequestPointerLock ||
                canvas.webkitRequestPointerLock;

        // Ask the browser to lock the pointer
        canvas.requestPointerLock();
    }

    // called by the browser event and others
    PointerLockManager.prototype.update = function(e, options) {
        options = options ? options : {};
        nc.trigger(nc.ns.client.pointerLock.change, this.isLocked(), options);
    };

    PointerLockManager.prototype.isLocked = function() {
        return document.pointerLockElement === this.canvas ||
           document.mozPointerLockElement === this.canvas ||
           document.webkitPointerLockElement === this.canvas;
    };
 
    return new PointerLockManager();
});