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

    Debug.prototype.render = function(centerPosition, zoom) {
         Parent.prototype.render.call(this, centerPosition, zoom);

         this.container.x -= 300 * zoom;
         this.container.y -= 200 * zoom;
     }; 
    
    return new Debug();
});