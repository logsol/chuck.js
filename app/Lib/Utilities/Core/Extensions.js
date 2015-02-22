define([
],
 
function () {

	"use strict";

	String.prototype.toUpperCaseFirstChar = function () {
		var f = this.charAt(0).toUpperCase();
		return f + this.substr(1);
	}

	String.prototype.pad = function (max, alignLeft) {
        var string = this.substring(0, max - 1);

        var spaces = new Array( max - string.length + 1 ).join(" ");
        if(alignLeft) {
            return string + spaces;
        } else {
            return spaces + string;
        }
    }
    
});