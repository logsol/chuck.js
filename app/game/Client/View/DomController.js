define(['Chuck/Settings'], function(Settings) {

	var Dom = {
		canvas: null,
		debugCanvas: null
	};

	Dom.getCanvasContainer = function(){
		var container = document.getElementById(Settings.CANVAS_DOM_ID);

		if(container) {
			return container;
		} else {
			throw 'Canvas Container missing: #' + Settings.CANVAS_DOM_ID;
		}
	}

	Dom.getCanvas = function(){
		return Dom.canvas;
	}

	Dom.setCanvas = function(canvas){
		
		var container = Dom.getCanvasContainer();
		if(Dom.canvas){
			container.removeChild(Dom.canvas);
		}

		Dom.canvas = canvas;
		container.appendChild(canvas);
	}

	Dom.getDebugCanvas = function(){
		return Dom.debugCanvas;
	}

	Dom.createDebugCanvas = function(){
		
		var container = Dom.getCanvasContainer();
		if(Dom.debugCanvas){
			container.removeChild(Dom.debugCanvas);
		}

		var canvas = document.createElement('canvas');
		canvas.width = Settings.STAGE_WIDTH;
		canvas.height = Settings.STAGE_HEIGHT;
		Dom.debugCanvas = canvas;
		container.appendChild(canvas);
	}

	return Dom;
	
});