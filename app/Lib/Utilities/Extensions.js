define([
],
 
function() {

	String.prototype.toUpperCaseFirstChar = function () {
		var f = this.charAt(0).toUpperCase();
		return f + this.substr(1);
	}

	if(typeof process !== 'undefined') {
		
		console.checkpoint = function (s) {
			console.log('   \033[32mbeep  - \033[0m' + s);
		}

		console.warn = function (s) {
			console.log('   \033[33mwarn  - \033[0m' + s);
		}

		console.error = function (s) {
			console.log('   \033[31merror - \033[0m' + s);
		}		
	}

});