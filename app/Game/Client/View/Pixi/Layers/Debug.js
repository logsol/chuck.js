define([
	"Game/Client/View/Pixi/Layer",
	"Lib/Vendor/Pixi",
],
 
function (Parent, PIXI) {

	"use strict";
 
    function Debug() {
    	Parent.call(this, "debug", 0.00000001);

        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);
    }

    Debug.prototype = Object.create(Parent.prototype);

    return new Debug();
});