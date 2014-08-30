define([
	"Lib/Vendor/Pixi",
],

function (PIXI) {
    
    function Layer (name, parallax) {
    	this.name = name;
    	this.container = new PIXI.DisplayObjectContainer();
    	this.parallax = parallax;
    }

    Layer.prototype.getContainer = function() {
    	return this.container;
    };

    return Layer;
});