define([
],
 
function() {
 
    function GameObject() {
    	this.body = null;
    }
 
    GameObject.prototype.render = function() {
        return null;
    }

    GameObject.prototype.getBody = function() {
    	return this.body;
    };
 
    return GameObject;
 
});