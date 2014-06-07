define([
	"Game/Client/Player",
	"Game/Config/Settings"
],
 
function (Parent, Settings) {
 
    function Me(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);

    	this.lastServerPositionState = {
    		p: {
    			x: 0,
    			y: 0
    		}
    	};
    }

    Me.prototype = Object.create(Parent.prototype);
 
    Me.prototype.setLastServerPositionState = function(update) {
    	this.lastServerPositionState = update;
    };

	Me.prototype.isPositionStateUpdateNeeded = function() {

		if(!this.doll) {
            return false;
        }

        if(this.doll.isAnotherPlayerNearby()) {
            return false;
        }

		var difference = {
			x: Math.abs(this.lastServerPositionState.p.x - this.doll.body.GetPosition().x),
			y: Math.abs(this.lastServerPositionState.p.y - this.doll.body.GetPosition().y)
		}

		if(difference.x > Settings.ME_STATE_MAX_DIFFERENCE_METERS
		   || difference.y > Settings.ME_STATE_MAX_DIFFERENCE_METERS) {
			return true;
		}
    	return false;
    };

    Me.prototype.getPositionStateUpdate = function() {
    	return {
    		p: this.doll.body.GetPosition().Copy(),
    		lv: this.doll.body.GetLinearVelocity().Copy()
    	}
    };

    Me.prototype.acceptPositionStateUpdateFromServer = function() {
        // gamecontroller should accept  me's doll update only when another players doll is nearby.
        return this.doll.isAnotherPlayerNearby();
    };

    Me.prototype.resetPositionState = function(options) {
        this.doll.body.SetPosition(options.p);
        this.doll.body.SetLinearVelocity(options.lv);
    };

    return Me;
 
});