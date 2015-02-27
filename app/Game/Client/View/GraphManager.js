define([
	"Lib/Vendor/Chart"
],
 
function (Chart) {

    "use strict";
 
    function GraphManager(ctxFps) {

    	var numberOfGraphBarsFPS = 25;

    	var empty = new Array(numberOfGraphBarsFPS);
    	for (var i = empty.length - 1; i >= 0; i--) empty[i] = -1;

    	var data = {
	    labels: empty,
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,1)",
	            strokeColor: "rgba(220,220,220,1)",
	            highlightFill: "rgba(220,220,220,1)",
	            data: empty
	        },
	    ]};

		var options = {
			showScale: false,
			scaleShowLabels: false,
			showTooltips: false,
			animation: false,
		    scaleBeginAtZero : true,
		    scaleShowGridLines : false,
		    scaleShowHorizontalLines: true,
		    scaleShowVerticalLines: true,
		    barShowStroke : false,
		    barStrokeWidth : 0,
		    barValueSpacing : 0,
		    barDatasetSpacing : 0,
		    responsive: false,
		    scaleBackdropPaddingY : 10,
		    scaleOverride: true, 
		    scaleStartValue: 0, 
		    scaleStepWidth: 1, 
		    scaleSteps: 60
		}
        
        this.fpsGraph = new Chart(ctxFps).Bar(data, options);
        this.frameCounter = 0;

        var self = this;

        setInterval(function(){
        	self.fpsGraph.addData( [self.frameCounter], "" );
        	var color;
        	var alpha = 0.8;

        	if (self.frameCounter >= 50) {
        		color = "rgba(136, 209, 018, " + alpha +  ")";
        	} else if (self.frameCounter > 25) {
        		color = "rgba(204, 114, 018, " + alpha +  ")";
        	} else {
        		color = "rgba(224, 018, 018, " + 1 +  ")";
        	}

        	self.fpsGraph.datasets[0].bars[self.fpsGraph.datasets[0].bars.length-1].fillColor = color;
	        self.fpsGraph.removeData();
		    self.fpsGraph.update();
		    self.frameCounter = 0;
        }, 1000);
    }
 
    GraphManager.prototype.fpsStep = function() {
    	this.frameCounter++;
    }
 
    return GraphManager;
 
});