define([
	"Game/Config/Settings",
    "Lib/Utilities/Exception",
    "Game/Client/View/Abstract/View",
	//"Game/Client/View/Three/View",
	"Game/Client/View/Pixi/View",
    "Lib/Utilities/NotificationCenter"
],
 
function (Settings, Exception, AbstractView, PixiView, nc) {

	"use strict";
 
    var ViewManager = {};

    ViewManager.createView = function() {
        var view = null
        switch(Settings.VIEW_CONTROLLER) {
            //case 'Three': 
            //    view = new ThreeView();
            //    break;
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

        return view;
    }
 
    return ViewManager;
 
});