define([
	"Lib/Utilities/NotificationCenter",
],
 
function (nc) {

	var MAX_LENGTH = 200;
	var MIN_LENGTH = 5;
 
	function Swiper() {
		this.points = [];
		this.angleSum = 0;
		this.lengthSum = 0;
		this.finished = false;
	}
 
	Swiper.prototype.swipe = function(x, y) {

		if(this.finished) return;

		var points = this.points;

		// Check if swipe is long enough to count
		if(points.length >= 1) {
			var lastPoint = points[points.length-1];
			var a = Math.abs(x) - Math.abs(lastPoint.x);
			var b = Math.abs(y) - Math.abs(lastPoint.y);
			var currentLength = Math.sqrt(a * a + b * b); // Pythagoras -> hypotenuse
			
			if(currentLength < MIN_LENGTH) return;
		}

		points.push({x:x, y:y});
	
		if(points.length >= 2) {
			
			this.updateLengthSum(currentLength);

			if(this.points.length >= 3) {
				this.updateAngleSum(currentLength);
			}
		}

		var i = points.length - 1;
		nc.trigger(nc.ns.client.view.swiper.swipe, points[i].x, points[i].y);
	}

	Swiper.prototype.updateLengthSum = function(currentLength) {
		var points = this.points;
		var i = points.length - 1;

		var lengthSum = this.lengthSum + Math.abs(currentLength);
		if(lengthSum > MAX_LENGTH) {
			
			var diff = lengthSum - MAX_LENGTH;
			var ratio = (currentLength - diff) / currentLength;

			// Offset triangle to origin
			var x0 = points[i].x - points[i-1].x;
			var y0 = points[i].y - points[i-1].y;

			// Multiply with ratio and offset back
			var clippedX = x0 * ratio + points[i-1].x;
			var clippedY = y0 * ratio + points[i-1].y;
											 
			points[i].x = clippedX;
			points[i].y = clippedY;

			this.finished = true;

			lengthSum = MAX_LENGTH;
		}

		this.lengthSum = lengthSum;
	};

	Swiper.prototype.updateAngleSum = function(currentLength) {

		var points = this.points;
		var i = points.length - 1;
		
		// last two lines
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
		
		var lastLength = Math.sqrt(
			Math.pow(vectors[1].x, 2) 
			+ Math.pow(vectors[1].y, 2)
		);
		
		var angle = 180 - (Math.acos((dotProduct / (currentLength * lastLength)) % 1)  * 180 / Math.PI);
		angle *= direction;
		
		if(!isNaN(parseFloat(angle)) && direction != 0) {
			this.angleSum += angle;
		}
	};

	Swiper.prototype.swipeEnd = function(x, y) {
		var angularVelocity = this.angleSum;
		var length = this.lengthSum;

		if (this.points.length < 1) {
			return {
				x: 0,
				y: 0,
				av: 0
			}
		}

		var p0x = this.points[0].x;
		var p0y = this.points[0].y;
		var sumx = 0;
		var sumy = 0;

		nc.trigger(nc.ns.client.view.swiper.end);
		
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
		this.finished = false;
		
		return {
			x: direction.x * length / 100,
			y: direction.y * length / 100,
			av: angularVelocity / 100
		}
	}

	Swiper.prototype.destroy = function() {
		for (var i = 0; i < this.ncTokens.length; i++) {
			nc.off(this.ncTokens[i]);
		};
	};
 
	return Swiper;
 
});