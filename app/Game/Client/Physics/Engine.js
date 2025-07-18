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
        // Use the PIXI debug layer instead of creating a canvas overlay
        this.debugDraw = new PlanckDebugDraw(debugLayer.graphics);
    };

    Engine.prototype.renderDebug = function () {
        if (this.debugDraw && this.debugMode) {
            this.debugDraw.clear();
            this.debugDraw.drawWorld(this.world);
        }
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