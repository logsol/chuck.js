define([
    "Lib/Vendor/Planck"
],
 
function (Box2D) {

    "use strict";

    // Wrapper for PlanckDebugDraw
    function DebugDraw(canvas) {
        // Use the PlanckDebugDraw implementation
        var PlanckDebugDraw = require('./PlanckDebugDraw');
        return new PlanckDebugDraw(canvas);
    }

    return DebugDraw;
 
});