define([
    "Lib/Utilities/NotificationCenter",
    "Lib/Utilities/Exception",
    "Game/Client/View/Pixi/Layer"
],
 
function (Nc, Exception, Layer) {
 
    function LayerManager(container) {
        this.layers = [];
        this.container = container;

        this.ncTokens = [
            Nc.on(Nc.ns.client.view.layer.createAndInsert, this.createAndInsert, this),
            Nc.on(Nc.ns.client.view.mesh.create, this.createMesh, this),
            Nc.on(Nc.ns.client.view.animatedMesh.create, this.createAnimatedMesh, this),
            Nc.on(Nc.ns.client.view.mesh.add, this.addMesh, this),
            Nc.on(Nc.ns.client.view.mesh.remove, this.removeMesh, this),
            Nc.on(Nc.ns.client.view.mesh.update, this.updateMesh, this),
            Nc.on(Nc.ns.client.view.mesh.addFilter, this.addFilter, this),
            Nc.on(Nc.ns.client.view.mesh.removeFilter, this.removeFilter, this)
        ];
    }
 
    /*
     * If no referenceId is given, the layer is inserted in the far background (behind=true)
     * or in the foreground (behind=false/null)
     */
    LayerManager.prototype.createAndInsert = function(id, parallaxSpeed, behind, referenceId) {

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
            referenceIndex = behind ? 0 : this.container.children.length;
        }

        var layer =  new Layer(id, parallaxSpeed);
        var layerIndex = behind ? referenceIndex : referenceIndex + 1;

        this.layers.splice(layerIndex, 0, layer);
        
        this.rearrangeLayers();
    };

    LayerManager.prototype.rearrangeLayers = function() {

        var layer;

        for (var i = this.layers.length - 1; i >= 0; i--) {
            layer = this.layers[i];
            if (this.container.children.indexOf(layer.getContainer()) !== -1) {
                this.container.removeChild(layer.getContainer());
            }
        };

        if (this.container.children.length !== 0) {
            console.warn('Unmanaged stuff in container... ', this.container.children);
            //throw new Exception('Unmanaged dirt in container... ');
        }

        for (var i = 0; i < this.layers.length; i++) {
            layer = this.layers[i];
            this.container.addChildAt(layer.getContainer(), i);
        };
    };

    LayerManager.prototype.getLayerById = function(id) {
    	for (var i = 0; i < this.layers.length; i++) {
    		var layer = this.layers[i];
    		if (layer.getName() === id) {
    			return layer;
    		}
    	};
        return null;
    };

    LayerManager.prototype.delegate = function() {
        var methodName = arguments[0];
        var layerId = arguments[1];
    	var layer = this.getLayerById(layerId);

        if (!layer) {
            throw new Exception('Layer (' + layerId + ') does not exist.');
        }

    	var args = arguments;
        Array.prototype.splice.call(args, 0, 2);

    	layer[methodName].apply(layer, args);
    };

    LayerManager.prototype.createMesh = function() {
        var args = arguments;
        Array.prototype.splice.call(args, 0, 0, 'createMesh')

    	this.delegate.apply(this, args);
    };

    LayerManager.prototype.createAnimatedMesh = function() {
        Array.prototype.splice.call(arguments, 0, 0, 'createAnimatedMesh')
    	this.delegate.apply(this, arguments);
    };

    LayerManager.prototype.addMesh = function() {
        Array.prototype.splice.call(arguments, 0, 0, 'addMesh')
    	this.delegate.apply(this, arguments);
    };

    LayerManager.prototype.removeMesh = function() {
        Array.prototype.splice.call(arguments, 0, 0, 'removeMesh')
    	this.delegate.apply(this, arguments);
    };

    LayerManager.prototype.updateMesh = function() {
        Array.prototype.splice.call(arguments, 0, 0, 'updateMesh')
    	this.delegate.apply(this, arguments);
    };

    LayerManager.prototype.addFilter = function() {
        Array.prototype.splice.call(arguments, 0, 0, 'addFilter')
    	this.delegate.apply(this, arguments);
    };

    LayerManager.prototype.removeFilter = function() {
        Array.prototype.splice.call(arguments, 0, 0, 'removeFilter')
    	this.delegate.apply(this, arguments);
    };

    LayerManager.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };
    };

    return LayerManager;
});