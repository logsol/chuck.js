define([
    "Game/Core/Physics/Engine",
    "Game/Config/Settings",
    "Game/Client/View/DomController",
    "Lib/Vendor/Box2D"
],

function (Parent, Settings, DomController, Box2D) {

    function Engine () {
        Parent.call(this);

        if(Settings.DEBUG_MODE) {
            this.setupDebugDraw();
        }
    }

    Engine.prototype = Object.create(Parent.prototype);

    Engine.prototype.setupDebugDraw = function () {
        //var debugSprite = Settings.DEBUG_DRAW_CANVAS_SPRITE;
        var debugSprite = DomController.getDebugCanvas().getContext("2d");

        // set debug draw
        var debugDraw = new Box2D.Dynamics.b2DebugDraw();

        debugDraw.SetSprite(debugSprite);
        debugDraw.SetDrawScale(Settings.RATIO);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);

        debugDraw.SetFlags(null
            | Box2D.Dynamics.b2DebugDraw.e_shapeBit 
            | Box2D.Dynamics.b2DebugDraw.e_jointBit 
            //| Box2D.Dynamics.b2DebugDraw.e_coreShapeBit
            //| Box2D.Dynamics.b2DebugDraw.e_aabbBit
            | Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit
            //| Box2D.Dynamics.b2DebugDraw.e_obbBit
            //| Box2D.Dynamics.b2DebugDraw.e_pairBit
        );

        this.world.SetDebugDraw(debugDraw);
        this.world.SetWarmStarting(true);
    }


    Engine.prototype.update = function () {
        Parent.prototype.update.call(this);

        this.world.DrawDebugData();
    }

    return Engine;
})