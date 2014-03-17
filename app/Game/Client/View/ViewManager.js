define([
	"Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Game/Client/View/Views/AbstractView",
	//"Game/Client/View/Views/ThreeView",
	"Game/Client/View/Views/PixiView",
    "Lib/Utilities/NotificationCenter"
],
 
function (Settings, Exception, AbstractView, PixiView, Nc) {
 
    var ViewManager = {};

    ViewManager.createView = function() {
        var view = null
        switch(Settings.VIEW_CONTROLLER) {
            case 'Three': 
                view = new ThreeView();
                break;
            case 'Pixi':
                view = new PixiView();
                break;
            default:
                throw new Exception("A view called", Settings.VIEW_CONTROLLER, "has not been (fully) implemented.");
        }

        if(!(view instanceof AbstractView)) {
            throw new Exception("The view", Settings.VIEW_CONTROLLER + 'View', "must extend AbstractView!");
        }

        if(!view.canvas) {
            throw new Exception("In the view", Settings.VIEW_CONTROLLER + 'View', "the method 'this.setCanvas(canvas)' has not been called");
        }

        if(!(view.canvas instanceof HTMLCanvasElement)) {
            throw new Exception("In the view", Settings.VIEW_CONTROLLER + 'View', "this.setCanvas(canvas) has not been called with a valid HTMLCanvasElement!");
        }

        Nc.trigger(Nc.ns.client.view.events.ready, view);

        return view;
    }
 
    return ViewManager;
 
});