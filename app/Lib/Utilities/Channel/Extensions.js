define([
	"Lib/Utilities/Core/Extensions"
],
 
function (Parent) {

    //"use strict";
		
	console.checkpoint = function (s) {
		console.log("   \033[32mbeep  - \033[0m" + s);
	}

	console.warn = function (s) {
		console.log("   \033[33mwarn  - \033[0m" + s);
	}

	console.error = function (s) {
		console.log("   \033[31merror - \033[0m" + s);
	}		
	
 
});