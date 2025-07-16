define([
    "Game/Core/Loader/DebugLevel"
],

function (Parent) {

    "use strict";

    function DebugLevel(uid, engine) {
        Parent.call(this, uid, engine);
    }

    DebugLevel.prototype = Object.create(Parent.prototype);

    // Channel side doesn't need any special handling beyond the core functionality
    // The physics engine and tile creation is handled by the parent class

    return DebugLevel;
}); 