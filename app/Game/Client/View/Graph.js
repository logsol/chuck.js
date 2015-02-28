define([
	"Lib/Vendor/Chart"
],
 
function (Chart) {

    "use strict";
 
    function Graph(ctx) {

    	var numberOfGraphBars = 25;

    	var empty = new Array(numberOfGraphBars);
    	for (var i = empty.length - 1; i >= 0; i--) empty[i] = -1;

    	var data = {
	    labels: empty,
	    datasets: [
	        {
	            label: "no label",
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
        
        this.chart = new Chart(ctx).Bar(data, options);
        this.frameCounter = 0;

        var self = this;

        setInterval(function(){
        	self.chart.addData( [self.frameCounter], "" );
        	var color;
        	var alpha = 0.8;

        	if (self.frameCounter >= 50) {
        		color = "rgba(136, 209, 018, " + alpha +  ")";
        	} else if (self.frameCounter > 25) {
        		color = "rgba(204, 114, 018, " + alpha +  ")";
        	} else {
        		color = "rgba(224, 018, 018, " + 1 +  ")";
        	}

        	self.chart.datasets[0].bars[self.chart.datasets[0].bars.length-1].fillColor = color;
	        self.chart.removeData();
		    self.chart.update();
		    self.frameCounter = 0;

        }, 1000);
    }
 
    Graph.prototype.step = function() {
    	this.frameCounter++;
    }
 
    return Graph;
 
});