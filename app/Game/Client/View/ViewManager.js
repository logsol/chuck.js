define([
	"Game/Config/Settings",
	"Game/Client/View/Views/ThreeView",
	"Game/Client/View/Views/PixiView",
],
 
function (Settings, ThreeView, PixiView) {
 
    function ViewManager() {
    }
 
    ViewManager.prototype.createView = function(arguments) {
        switch(Settings.VIEW_CONTROLLER) {
            case 'Three': 
                return new ThreeView();
                break;
            case 'Pixi':
                return new PixiView();
                break;
            default:
                return false;
        }
    }
 
    return ViewManager;
 
});