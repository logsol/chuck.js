define([
	"Game/Client/Player",
	"Game/Config/Settings"
],
 
function (Parent, Settings) {
 
    function Me(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);

    	this.lastServerState = {
    		p: {
    			x: 0,
    			y: 0
    		}
    	};
    }

    Me.prototype = Object.create(Parent.prototype);
 
    Me.prototype.setLastServerState = function(update) {
    	this.lastServerState = update;
    };

	Me.prototype.isStateUpdateNeeded = function() {

		if(!this.doll) return false;

		var difference = {
			x: Math.abs(this.lastServerState.p.x - this.doll.body.GetPosition().x),
			y: Math.abs(this.lastServerState.p.y - this.doll.body.GetPosition().y)
		}

		if(difference.x > Settings.ME_STATE_MAX_DIFFERENCE_METERS
		   || difference.y > Settings.ME_STATE_MAX_DIFFERENCE_METERS) {
		   	console.log('AAAAHHHH');
			return true;
		}
    	return false;
    };

    Me.prototype.getStateUpdate = function() {
    	return {
    		p: this.doll.body.GetPosition().Copy(),
    		lv: this.doll.body.GetLinearVelocity().Copy()
    	}
    };

    return Me;
 
});