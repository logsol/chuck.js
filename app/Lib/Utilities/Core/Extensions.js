define([
],
 
function () {

	"use strict";

	String.prototype.toUpperCaseFirstChar = function () {
		var f = this.charAt(0).toUpperCase();
		return f + this.substr(1);
	}
});