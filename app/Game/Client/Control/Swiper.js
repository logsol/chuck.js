define([
	"Lib/Utilities/NotificationCenter",
],
 
function (Nc) {

	var MAX_LENGTH = 150;
 
    function Swiper() {
	    this.points = [];
	    this.angleSum = 0;
	    this.lengthSum = 0;
    }
 
    Swiper.prototype.swipe = function(x, y) {

	            
	    if(this.lengthSum > MAX_LENGTH) return;
	    
	    this.points.push({x:x, y:y});

	    Nc.trigger(Nc.ns.client.view.swiper.swipe, x, y);

	    var points = this.points;
	    
	    if(points.length >= 3) {
	        
	        var i = points.length - 1;
	        
	        var vectors = [
	            { 
	                x: points[i].x - points[i-1].x,
	                y: points[i].y - points[i-1].y
	            },
	            { 
	                x: points[i-2].x - points[i-1].x,
	                y: points[i-2].y - points[i-1].y
	            }
	        ];
	        
	        var yx = vectors[0].y * vectors[1].x;
	        var xy = vectors[0].x * vectors[1].y;
	        var direction = 0;
	        if(yx > xy) {
	            direction = -1;
	        } else if (yx < xy) {
	            direction = 1;
	        }
	        
	        var dotProduct = vectors[0].x 
	            * vectors[1].x 
	            + vectors[0].y 
	            * vectors[1].y;

	        var currentLength = Math.sqrt(
	            Math.pow(vectors[0].x, 2) 
	            + Math.pow(vectors[0].y, 2)
	        );
	        var lastLength = Math.sqrt(
	            Math.pow(vectors[1].x, 2) 
	            + Math.pow(vectors[1].y, 2)
	        );

	        var angle = 180 - (Math.acos((dotProduct / (currentLength * lastLength)) % 1)  * 180 / Math.PI);
	        angle *= direction;
	        
	        if(!isNaN(parseFloat(angle)) && direction != 0) {
	            this.angleSum += angle;
	        }
	        
	        if(!isNaN(parseFloat(currentLength))) {
	            this.lengthSum += Math.abs(currentLength);
	        }
	    }
    }

    Swiper.prototype.swipeEnd = function(x, y) {
	    var angularVelocity = this.angleSum;
	    var length = this.lengthSum;
	    var p0x = this.points[0].x;
	    var p0y = this.points[0].y;
	    var sumx = 0;
	    var sumy = 0;

	    Nc.trigger(Nc.ns.client.view.swiper.end);
	    
	    for(var i=0, count = this.points.length; i < count; i++) {
	        var p = this.points[i];
	        sumx += p.x - p0x;
	        sumy += p.y - p0y;
	    }
	    
	    var direction = {
	        x: sumx / count,
	        y: sumy / count
	    };
	   
	    var larger = Math.abs(direction.x) > Math.abs(direction.y) ? direction.x : direction.y;
	    direction.x /= Math.abs(larger);
	    direction.y /= Math.abs(larger);  
	    
	    this.angleSum = 0;
	    this.lengthSum = 0;
	    this.points = [];
	    
	    return {
	    	x: direction.x * length / 100,
	    	y: direction.y * length / 100,
	    	av: angularVelocity / 100
	    }
	}

	Swiper.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };
    };
 
    return Swiper;
 
});