define([
    "Game/Client/View/ViewController",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi", 
    "Game/Config/Settings", 
    "Game/Client/View/CameraController"
], 

function (Parent, DomController, Pixi, Settings, CameraController) {
    
    function PixiView () {

        Parent.call(this);
    }

    PixiView.prototype = Object.create(Parent.prototype);
    
    PixiView.prototype.init = function() {
        Parent.prototype.init.call(this);
    };

    return PixiView;
});
