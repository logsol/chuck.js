define([
	"Game/Core/Player",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings"
],
 
function (Parent, Nc, Settings) {

	"use strict";
 
    function Player(id, physicsEngine, user, isMe) {
    	Parent.call(this, id, physicsEngine, user);

    	this.healthBarView = null;
    	this.healthBarViewVisibleTimeout = null;
    	this.healthBarViewVisible = false;
    	this.initHealthBar();

        Nc.on(Nc.ns.client.game.events.render, this.render, this);
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

    	this.healthBarViewVisible = false;

    	var options = {
    		x: 100,
    		y: 100,
    		healthFactor: this.stats.health / 100,
    		visible: this.healthBarViewVisible
    	};

    	var callback = function(healthBarView) {
    		self.healthBarView = healthBarView;
    	}
    	Nc.trigger(Nc.ns.client.view.healthBar.createAndAdd, callback, options);
    };

    Player.prototype.onHealthChange = function() {
    	if(this.stats.health != 100) {
    		this.setHealthBarVisible(true);
    	} 
    };

    Player.prototype.spawn = function(x, y) {
    	Parent.prototype.spawn.call(this, x, y);
    	this.setHealthBarVisible(false);
    };

    Player.prototype.setHealthBarVisible = function(visible) {
    	var self = this;
    	this.healthBarViewVisible = visible;
    	if(this.healthBarViewVisibleTimeout) clearTimeout(this.healthBarViewVisibleTimeout);

    	if(visible) {
	    	var position = this.getPosition();

	    	var options = {
	    		x: position.x * Settings.RATIO,
	    		y: position.y * Settings.RATIO,
	    		healthFactor: this.stats.health / 100,
	    		visible: this.healthBarViewVisible
	    	};
	    	Nc.trigger(Nc.ns.client.view.healthBar.update, this.healthBarView, options);

	    	this.healthBarViewVisibleTimeout = setTimeout(function() {
	    		self.healthBarViewVisible = false;
	    		Nc.trigger(Nc.ns.client.view.healthBar.update, self.healthBarView, {visible: self.healthBarViewVisible});
	    	}, Settings.HEALTH_DISPLAY_TIME * 1000);

    	} else {
    		Nc.trigger(Nc.ns.client.view.healthBar.update, this.healthBarView, {visible: this.healthBarViewVisible});
    	}
    };

    Player.prototype.render = function() {

        if(this.doll) {
            this.doll.render();
        } 

    	if(this.healthBarViewVisible) {
	    	var position = this.getPosition();
	    	var options = {
	    		healthFactor: this.stats.health / 100,
				x: position.x * Settings.RATIO,
	    		y: position.y * Settings.RATIO,
	    	}
	    	Nc.trigger(Nc.ns.client.view.healthBar.update, this.healthBarView, options);
    	}
    };

    Player.prototype.isHoldingSomething = function() {
        return !!this.holdingItem;
    };

    Player.prototype.destroy = function() {
        clearTimeout(this.healthBarViewVisibleTimeout);
    	Nc.trigger(Nc.ns.client.view.healthBar.remove, this.healthBarView);
        Parent.prototype.destroy.call(this);
    };
 
    return Player;
 
});