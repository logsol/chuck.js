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
            this.debugDraw.drawWorld(this.world);
        }
    };

    Engine.prototype.update = function () {
        Parent.prototype.update.call(this);

        if(this.debugMode) {
            this.world.DrawDebugData();
        }
    };

    return Engine;
});