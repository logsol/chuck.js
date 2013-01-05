define([
],
 
function() {

	String.prototype.toUpperCaseFirstChar = function () {
		var f = this.charAt(0).toUpperCase();
		return f + this.substr(1);
	}

});