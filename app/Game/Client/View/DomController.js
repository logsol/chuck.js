define(['Game/Config/Settings'], function(Settings) {

    var DomController = {
        canvas: null,
        debugCanvas: null
    };

    DomController.getCanvasContainer = function(){
        var container = document.getElementById(Settings.CANVAS_DOM_ID);

        if(container) {
            return container;
        } else {
            throw 'Canvas Container missing: #' + Settings.CANVAS_DOM_ID;
        }
    }

    DomController.getCanvas = function(){
        return DomController.canvas;
    }

    DomController.setCanvas = function(canvas){
        
        var container = DomController.getCanvasContainer();
        if(DomController.canvas){
            container.removeChild(DomController.canvas);
        }

        DomController.canvas = canvas;
        container.appendChild(canvas);
    }

    DomController.getDebugCanvas = function(){
        return DomController.debugCanvas;
    }

    DomController.createDebugCanvas = function(){
        
        var container = DomController.getCanvasContainer();
        if(DomController.debugCanvas){
            container.removeChild(DomController.debugCanvas);
        }

        var canvas = document.createElement('canvas');
        canvas.width = Settings.STAGE_WIDTH;
        canvas.height = Settings.STAGE_HEIGHT;
        DomController.debugCanvas = canvas;
        container.appendChild(canvas);
    }

    return DomController;
    
});