define([
	"Lib/Utilities/Exception"
],
 
function (Exception) {

	"use strict";
 
    function Abstract() {
    }
 
    Abstract.prototype.addMethod = function(methodName, params) {
       	this.prototype[methodName] = function() {
			throw new Exception("Abstract method", this, methodName + "(" + params.join(', ') + ") not overwritten.");
		}
    }
 
    return Abstract;
 
});