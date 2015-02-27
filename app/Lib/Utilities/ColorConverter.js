define([
	"Lib/Vendor/CryptoJS"
],
 
function (CryptoJS) {

	"use strict";
 
    function ColorConverter() {
    	this.sin = 0;
    	var palette = [
			0x634c72,
			0x724c5e,
			0x787950,
			0x507971,
			0x506a79,
			0x8c423c,
			0x557e4a,
			0x436785,
			0xa62423,
			0x427f87,
			0x472e1a,
			0x4d667c,
			0x2a3c49,
			0x7c7e2b,
			0x3b3c21,
			0x263c27,
			0x7e897e,
			0xb55014,
			0x978c32,
			0x739137,
			0x46824f,
			0x19b0b4,
			0x1c1eb1,
			0xccb206,
			0x433e20,
			0x201a13,
			0x145396,
			0x313d08,
			0xb7a345,
			0xdc168a,
			0x310505,
			0x051631,
		];
		/* 
	    var element, color;
	    
	    var start = 5;
	    var step = 4;
        var max = 16;

	    for(var r=start; r<max; r+=step) {
	        for(var g=start; g<max; g+=step) {
	            for(var b=start; b<max; b+=step) {
	                
	                color = r.toString(16) 
	                		+ r.toString(16) 
	                		+ g.toString(16) 
	                		+ g.toString(16)
	                		+ b.toString(16)
	                		+ b.toString(16);
	                
	                palette.push(parseInt(color, 16));
	            }
	        }
	    }*/

	    this.palette = palette;
    }
 
    ColorConverter.prototype.getColorByName = function(name) {
    	name = CryptoJS.MD5(name).toString();
	    var ac = 0;  
		for(var c = 0; c < name.length; c++) {
			ac += name.charCodeAt(c) * 3;
		}
		return this.palette[ac % this.palette.length];
    }
 
    return ColorConverter;
 
});

