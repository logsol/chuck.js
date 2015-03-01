define([
    "Game/Core/Physics/Engine",
    "Game/Config/Settings",
    "Game/Client/View/DomController",
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter",
    "Game/Client/View/Pixi/DebugDraw",
    "Game/Client/View/Pixi/Layers/Debug"
],

function (Parent, Settings, DomController, Box2D, Nc, DebugDraw, DebugLayer) {

	"use strict";

    function Engine () {
        Parent.call(this);

        this.debugMode = false;

        Nc.on(Nc.ns.client.view.debugMode.toggle, this.onToggleDebugMode, this);
    }

    Engine.prototype = Object.create(Parent.prototype);

    Engine.prototype.onToggleDebugMode = function(debugMode) {
        this.debugMode = debugMode;

        if(this.debugMode && !this.debugDraw) {
            this.setupDebugDraw();
        }
    };

    Engine.prototype.setupDebugDraw = function () {

        // set debug draw
        this.debugDraw = new DebugDraw();

        this.debugDraw.SetSprite(DebugLayer.graphics);
        this.debugDraw.SetDrawScale(Settings.RATIO);
        this.debugDraw.SetFillAlpha(0.5);
        this.debugDraw.SetLineThickness(1.0);

        this.debugDraw.SetFlags(null
            | Box2D.Dynamics.b2DebugDraw.e_shapeBit 
            | Box2D.Dynamics.b2DebugDraw.e_jointBit 
            //| Box2D.Dynamics.b2DebugDraw.e_coreShapeBit
            //| Box2D.Dynamics.b2DebugDraw.e_aabbBit
            //| Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit
            //| Box2D.Dynamics.b2DebugDraw.e_obbBit
            //| Box2D.Dynamics.b2DebugDraw.e_pairBit
        );

        this.world.SetDebugDraw(this.debugDraw);
    }

    Engine.prototype.update = function () {
        Parent.prototype.update.call(this);

        if(this.debugMode) {
            this.world.DrawDebugData();
        }
    }

    return Engine;
})