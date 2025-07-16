define([
    "Game/Core/Physics/Engine",
    "Game/Config/Settings",
    "Game/Client/View/DomController",
    "Lib/Vendor/Planck",
    "Lib/Utilities/NotificationCenter",
    "Game/Client/View/Pixi/PlanckDebugDraw",
    "Game/Client/View/Pixi/Layers/Debug"
],

function (Parent, Settings, domController, Box2D, nc, PlanckDebugDraw, debugLayer) {

	"use strict";

    function Engine () {
        Parent.call(this);

        this.debugMode = false;

        nc.on(nc.ns.client.view.debugMode.toggle, this.onToggleDebugMode, this);
    }

    Engine.prototype = Object.create(Parent.prototype);

    Engine.prototype.onToggleDebugMode = function(debugMode) {
        this.debugMode = debugMode;

        if(!this.debugDraw) {
            this.setupDebugDraw();
        }

        debugLayer.container.visible = this.debugMode;
    };

    Engine.prototype.setupDebugDraw = function () {

        // set debug draw for Planck.js
        var canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1000';
        document.body.appendChild(canvas);
        
        this.debugDraw = new PlanckDebugDraw(canvas);
        this.debugCanvas = canvas;
    };

    Engine.prototype.renderDebug = function () {
        if (this.debugDraw) {
            this.debugDraw.clear();
            
            // Get camera position from the game view
            var cameraPos = this.getCameraPosition();
            var zoom = this.getCameraZoom();
            
            // Apply camera transformations to debug draw
            this.debugDraw.setTransform(cameraPos, zoom);
            this.debugDraw.drawWorld(this.world);
        }
    };

    Engine.prototype.getCameraPosition = function() {
        // Get camera position from the view system
        // This needs to match the layer positioning logic
        if (this.gameController && this.gameController.view && this.gameController.view.layerManager) {
            var layerManager = this.gameController.view.layerManager;
            var tileLayer = layerManager.getLayerById('tile'); // Use tile layer as reference
            
            if (tileLayer) {
                return {
                    x: tileLayer.position.current.x,
                    y: tileLayer.position.current.y,
                    zoom: tileLayer.zoom.current
                };
            }
        }
        
        // Fallback to default position
        return { x: 0, y: 0, zoom: 1 };
    };

    Engine.prototype.getCameraZoom = function() {
        if (this.gameController && this.gameController.view && this.gameController.view.layerManager) {
            var layerManager = this.gameController.view.layerManager;
            var tileLayer = layerManager.getLayerById('tile');
            
            if (tileLayer) {
                return tileLayer.zoom.current;
            }
        }
        
        return 1;
    };

    Engine.prototype.setGameController = function(gameController) {
        this.gameController = gameController;
    };

    Engine.prototype.update = function () {
        Parent.prototype.update.call(this);

        if(this.debugMode && this.debugDraw) {
            this.debugDraw.drawWorld(this.world);
        }
    };

    return Engine;
});