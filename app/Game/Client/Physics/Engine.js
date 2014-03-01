define([
    "Game/Core/Physics/Engine",
    "Game/Config/Settings",
    "Game/Client/View/DomController",
    "Lib/Vendor/Box2D",
    "Lib/Utilities/NotificationCenter"
],

function (Parent, Settings, DomController, Box2D, Nc) {

    function Engine () {
        Parent.call(this);

        this.debugMode = false;

        Nc.on("view/toggleDebugMode", this.onToggleDebugMode, this);
    }

    Engine.prototype = Object.create(Parent.prototype);

    Engine.prototype.onToggleDebugMode = function(debugMode) {
        this.debugMode = debugMode;

        if(this.debugMode && !this.debugDraw) {
            this.setupDebugDraw();
        }
    };

    Engine.prototype.setupDebugDraw = function () {

        var debugSprite = DomController.getDebugCanvas().getContext("2d");

        // set debug draw
        this.debugDraw = new Box2D.Dynamics.b2DebugDraw();

        this.debugDraw.SetSprite(debugSprite);
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