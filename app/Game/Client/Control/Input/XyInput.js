define([
	"Lib/Utilities/NotificationCenter"
],
 
function (Nc) {

	"use strict";
 
    function XyInput() {
    	this.x = null;
    	this.y = null
    }

    XyInput.prototype.onXyChange = function(x, y) {
    	this.x = x;
    	this.y = y;
    	Nc.trigger(Nc.ns.client.input.xy.change, x, y);
    }
 
    return XyInput;
 
});