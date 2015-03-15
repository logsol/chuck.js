define([
	"Lib/Utilities/Exception"
],
 
function (Exception) {

    "use strict";
 
    var Assert = {};

    Assert.number = function() {
		for (var i = 0; i < arguments.length; i++) {
			if(isNaN(parseFloat(arguments[i]))) {
				throw new Exception("Assert: not a number ", JSON.stringify(arguments));
			}
		}
	};
  
    return Assert;
 
});