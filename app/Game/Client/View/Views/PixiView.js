define([
    "Game/Client/View/Views/AbstractView",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi", 
    "Game/Config/Settings"
], 

function (Parent, DomController, Pixi, Settings) {
    
    function PixiView () {

        Parent.call(this);
    }

    PixiView.prototype = Object.create(Parent.prototype);
    
    PixiView.prototype.init = function() {
        Parent.prototype.init.call(this);
    };

    return PixiView;
});
