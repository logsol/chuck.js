define([
	"Lib/Utilities/Abstract",
    "Lib/Utilities/NotificationCenter"
], 

function (Abstract, Nc) {

	"use strict";

    function Layer(name, options) {
    	this.name = name;
    	this.parallaxSpeed = options.parallaxSpeed || 0;
        this.zoom = { 
            current: window.innerWidth / 600,
            target: window.innerWidth / 600
        };
        this.position = {
            current: { x: 0, y: 0},
            target: { x: 0, y: 0}
        };

        if(options.levelSize) {
            this.position.current.x = -options.levelSize.width / 2;
            this.position.current.y = -options.levelSize.height / 2;            
        }

        this.ncTokens = [];
    }

    Object.defineProperty(Layer, 'ID', { 
        value: {
            TILE: 'tile',
            ITEM: 'item',
            SPAWN: 'spawnpoints'
        }
    });

    Abstract.prototype.addMethod.call(Layer, 'show');
    Abstract.prototype.addMethod.call(Layer, 'hide');
    Abstract.prototype.addMethod.call(Layer, 'createMesh', ['texturePath', 'callback', 'options']);
    Abstract.prototype.addMethod.call(Layer, 'createAnimatedMesh', ['texturePaths', 'callback', 'options']);
    Abstract.prototype.addMethod.call(Layer, 'addMesh', ['mesh']);
    Abstract.prototype.addMethod.call(Layer, 'removeMesh', ['mesh']);
    Abstract.prototype.addMethod.call(Layer, 'updateMesh', ['mesh', 'options']);
    Abstract.prototype.addMethod.call(Layer, 'render', ['centerPosition']);

    Layer.prototype.getName = function() {
        return this.name;
    };

    Layer.prototype.setPosition = function(centerPosition) {
        this.position.target.x = centerPosition.x;
        this.position.target.y = centerPosition.y;
    };

    Layer.prototype.setZoom = function(z) {
        this.zoom.target = z;
    };

    Layer.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };
    };

    return Layer;
});