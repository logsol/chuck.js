define([
],
 
function () {
 
    function ColorConverter() {
    	var palette = []; 
	    var element, color;
	    var start = 4;
	    var step = 2;
        var max = 6;
	    for(var r=start; r<max*step+start; r+=step) {
	        for(var g=start; g<max*step+start; g+=step) {
	            for(var b=start; b<max*step+start; b+=step) {
	                
	                color = r.toString(16) 
	                		+ r.toString(16) 
	                		+ g.toString(16) 
	                		+ g.toString(16)
	                		+ b.toString(16)
	                		+ b.toString(16);
	                
	                palette.push(parseInt(color, 16));
	            }
	        }
	    }

	    this.palette = palette;
    }
 
    ColorConverter.prototype.getColorByName = function(name) {
	    var ac = 0;  
		for(var c = 0; c < name.length; c++) {
			ac += name.charCodeAt(c);
		}
		return this.palette[ac * 9 % this.palette.length];
    }
 
    return ColorConverter;
 
});