define([
	"Lib/Vendor/Chart"
],
 
function (Chart) {

    "use strict";
 
    function Graph(ctx, isStepCounter, newOptions) {

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

		if (newOptions) {
			if (newOptions.scaleOverride) options.scaleOverride = newOptions.scaleOverride;
			if (newOptions.scaleStartValue) options.scaleStartValue = newOptions.scaleStartValue;
			if (newOptions.scaleSteps) options.scaleSteps = newOptions.scaleSteps;
			if (newOptions.scaleStepWidth) options.scaleStepWidth = newOptions.scaleStepWidth;
		} 
        
        this.chart = new Chart(ctx).Bar(data, options);
        this.stepCounter = 0;
        this.currentValue = 0;
        this.updateFunction = function(value){};

        var self = this;

        if (isStepCounter) {
	        setInterval(function(){
	        	self.addValue(null);
	        }, 1000);
        }

    }

    Graph.prototype.addValue = function (value) {

    	value = value ? value : this.stepCounter;

    	this.chart.addData( [value], "" );
	    this.currentValue = value;
	    this.stepCounter = 0;
	    var color = this.updateFunction(this.currentValue);
	    color = color ? color : "rgba(136, 209, 018, 1)"; // green
	    this.chart.datasets[0].bars[this.chart.datasets[0].bars.length-1].fillColor = color;
	  	this.chart.removeData();
	    this.chart.update();
    }
 
    Graph.prototype.step = function() {
    	this.stepCounter++;
    };

    Graph.prototype.getCurrentValue = function() {
    	return this.currentValue;
    };

    Graph.prototype.onUpdate = function(f) {
    	this.updateFunction = f;
    };
 
    return Graph;
 
});