define([
    "Lib/Vendor/Box2D",
    "Lib/Utilities/Exception"
],
 
function (Box2D, Exception) {
 
    function GameObject(physicsEngine) {
        var def = this.getBodyDef();
        this.body = physicsEngine.getWorld().CreateBody(def);
    }

    GameObject.prototype.getBodyDef = function() {
        throw new Exception('Abstract method GameObject.getBodyDef not overwritten');
    };

    GameObject.prototype.destroy = function() {
        if(this.body instanceof Box2D.Dynamics.b2Body) {
            this.body.GetWorld().DestroyBody(this.body);   
        }
    };

    GameObject.prototype.getBody = function() {
    	return this.body;
    };
 
    return GameObject;
 
});