define([
	"Game/Core/Player",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings"
],
 
function (Parent, Nc, Settings) {
 
    function Player(id, physicsEngine, user) {
    	Parent.call(this, id, physicsEngine, user);

    	this.playerInfoView = null;
    	this.playerInfoViewVisibleTimeout = null;
    	this.playerInfoViewVisible = false;
    	this.initHealthBar();
    }

    Player.prototype = Object.create(Parent.prototype);
 
    Player.prototype.setStats = function(stats) {
    	var oldHealth = this.stats.health;
        this.stats = stats;

        if(oldHealth != this.stats.health) {
        	this.onHealthChange();
        }
    }

    Player.prototype.initHealthBar = function() {
    	var self = this;

    	this.playerInfoViewVisible = false;

    	var options = {
    		x: 100,
    		y: 100,
    		healthFactor: this.stats.health / 100,
    		visible: this.playerInfoViewVisible
    	};

    	var callback = function(playerInfoView) {
    		self.playerInfoView = playerInfoView;
    	}
    	Nc.trigger(Nc.ns.client.view.playerInfo.createAndAdd, callback, options);
    };

    Player.prototype.onHealthChange = function() {
    	if(this.stats.health != 100) {
    		this.setPlayerInfoVisible(true);
    	} 
    };

    Player.prototype.spawn = function(x, y) {
    	Parent.prototype.spawn.call(this, x, y);
    	this.setPlayerInfoVisible(false);
    };

    Player.prototype.setPlayerInfoVisible = function(visible) {
    	var self = this;
    	this.playerInfoViewVisible = visible;
    	if(this.playerInfoViewVisibleTimeout) clearTimeout(this.playerInfoViewVisibleTimeout);

    	if(visible) {
	    	var position = this.getPosition();

	    	var options = {
	    		x: position.x * Settings.RATIO,
	    		y: position.y * Settings.RATIO,
	    		healthFactor: this.stats.health / 100,
	    		visible: this.playerInfoViewVisible
	    	};
	    	Nc.trigger(Nc.ns.client.view.playerInfo.update, this.playerInfoView, options);

	    	this.playerInfoViewVisibleTimeout = setTimeout(function() {
	    		self.playerInfoViewVisible = false;
	    		Nc.trigger(Nc.ns.client.view.playerInfo.update, self.playerInfoView, {visible: self.playerInfoViewVisible});
	    	}, Settings.HEALTH_DISPLAY_TIME * 1000);

    	} else {
    		Nc.trigger(Nc.ns.client.view.playerInfo.update, this.playerInfoView, {visible: this.playerInfoViewVisible});
    	}
    };

    Player.prototype.getNickname = function() {
        return this.user.options.nickname;
    };

    Player.prototype.render = function() {

        // dolls are self responsible

    	if(this.playerInfoViewVisible) {
	    	var position = this.getPosition();
	    	var options = {
	    		healthFactor: this.stats.health / 100,
				x: position.x * Settings.RATIO,
	    		y: position.y * Settings.RATIO,
	    	}
	    	Nc.trigger(Nc.ns.client.view.playerInfo.update, this.playerInfoView, options);
    	}
    };

    Player.prototype.destroy = function() {
    	Parent.prototype.destroy.call(this);
    	Nc.trigger(Nc.ns.client.view.playerInfo.remove, this.playerInfoView);
    };
 
    return Player;
 
});