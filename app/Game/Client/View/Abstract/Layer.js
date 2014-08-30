define([
	"Lib/Utilities/Abstract",
], 

function (Abstract) {

    function Layer(name, z, parallaxSpeed) {
    	this.name = name;
    	this.parallaxSpeed = parallaxSpeed;
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

    Layer.prototype.getName = function() {
        return this.name;
    };

    return Layer;
});