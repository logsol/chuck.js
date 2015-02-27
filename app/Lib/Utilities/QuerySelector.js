define([
],
 
function () {

    "use strict";
 
    function QuerySelector() {
        if (!document) {
			throw new Error("Using QuerySelector, but window.document is not defined.");
		}
    }
 
    QuerySelector.prototype.$ = function(selector) {
        return document.querySelector(selector);
    }

    QuerySelector.prototype.$$ = function(selector) {
		return document.querySelectorAll(selector);
    }
 
    return new QuerySelector();
});