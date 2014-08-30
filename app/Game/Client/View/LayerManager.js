define([
	    "Lib/Utilities/NotificationCenter"
],
 
function (Nc) {
 
    function LayerManager() {
        this.ncTokens = [
            Nc.on(Nc.ns.client.view.mesh.create, this.createMesh, this),
            Nc.on(Nc.ns.client.view.animatedMesh.create, this.createAnimatedMesh, this),
            Nc.on(Nc.ns.client.view.mesh.add, this.addMesh, this),
            Nc.on(Nc.ns.client.view.mesh.remove, this.removeMesh, this),
            Nc.on(Nc.ns.client.view.mesh.update, this.updateMesh, this),
            Nc.on(Nc.ns.client.view.mesh.addFilter, this.addFilter, this),
            Nc.on(Nc.ns.client.view.mesh.removeFilter, this.removeFilter, this)
        ];
    }
 
    LayerManager.prototype.createAndInsert = function(id, parallaxSpeed, referenceId, behind) {

        var referenceIndex = -1;
        behind = !!behind;

        if (referenceId) {
            for(var i = 0; i < this.layers.length; i++) {
                var layer = this.layers[i];

                if (layer.getName() === referenceId) {
                    referenceIndex = i;
                    break;
                }
            }
            if (referenceIndex === -1) {
                throw new Exception('Reference Layer (' + referenceId + ') could not be found');
            }
        } else { 
            referenceIndex = behind ? 0 : this.stage.children.length;
        }

        var layer =  new Layer(id, parallaxSpeed);

        var layerIndex = behind ? referenceIndex : referenceIndex + 1;

        this.layers.splice(layerIndex, 0, layer);
        this.stage.addChildAt(layer.getContainer(), layerIndex);
    };

    LayerManager.prototype.getLayerById = function(id) {
    	for (var i = 0; i < this.layers.length; i++) {
    		var layer = this.layers[i];
    		if (layer.getName() === id) {
    			return layer;
    		}
    	};
    	console.warn('No such layer: ' + id);
    };

    LayerManager.prototype.delegate = function(methodName, layerId) {
    	var layer = this.getLayerById(layerId);
    	var args = arguments.splice(0,2);

    	layer[methodName].apply(layer, args);
    };

    LayerManager.prototype.createMesh = function() {
    	this.delegate(arguments.splice(0,0,'createMesh'));
    };

    LayerManager.prototype.createAnimatedMesh = function() {
    	this.delegate(arguments.splice(0,0,'createAnimatedMesh'));
    };

    LayerManager.prototype.addMesh = function() {
    	this.delegate(arguments.splice(0,0,'addMesh'));
    };

    LayerManager.prototype.removeMesh = function() {
    	this.delegate(arguments.splice(0,0,'removeMesh'));
    };

    LayerManager.prototype.updateMesh = function() {
    	this.delegate(arguments.splice(0,0,'updateMesh'));
    };

    LayerManager.prototype.addFilter = function() {
    	this.delegate(arguments.splice(0,0,'addFilter'));
    };

    LayerManager.prototype.removeFilter = function() {
    	this.delegate(arguments.splice(0,0,'removeFilter'));
    };

    return LayerManager;
});