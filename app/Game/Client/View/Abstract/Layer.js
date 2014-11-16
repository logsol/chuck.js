define([
	"Lib/Utilities/Abstract",
], 

function (Abstract) {

    function Layer(name, parallaxSpeed) {
    	this.name = name;
    	this.parallaxSpeed = parallaxSpeed;
        this.zoom = { 
            current: 1, 
            target: 1
        };
        this.position = {
            current: { x: 0, y: 0},
            target: { x: 0, y: 0}
        };
    }

    Object.defineProperty(Layer, 'ID', { 
        value: {
            TILE: 'tile',
            ITEM: 'item',
            SPAWN: 'spawn'
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

    return Layer;
});