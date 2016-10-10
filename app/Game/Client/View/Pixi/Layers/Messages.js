define([
	"Game/Client/View/Pixi/Layer",
	"Lib/Vendor/Pixi",
	"Lib/Utilities/NotificationCenter",
    "Game/Config/Settings"
],
 
function (Parent, PIXI, nc, Settings) {

    "use strict";
 
    function Messages() {
    	Parent.call(this, "messages", {parallaxSpeed:-1});

		this.ncTokens = this.ncTokens.concat([
            nc.on(nc.ns.client.view.gameStats.kill, this.onKill, this)
        ]);

        this.mainTextOptions = {
            font: "normal 22px 'Joystix'",
            fill: "#cc0000",
            stroke: "rgba(0,0,0,0.8)",
            strokeThickness: 6
        };

        this.mainText = new PIXI.Text("", this.mainTextOptions);
        this.container.addChild(this.mainText);
        this.mainText.visible = false;
    }

    Messages.prototype = Object.create(Parent.prototype);
 
    Messages.prototype.onKill = function(options) {

    	var killer = options.killer.isMe ? "You" : options.killer.name;

    	var victim = options.victim.isMe 
    		? options.killer.isMe
    			? "Yourself" 
    			: "You"
    		: options.victim.name;

        var text = killer + " killed " + victim + " with " + options.item;

    	this.mainText.setText(text);
    	this.mainText.setStyle(this.mainTextOptions);
        this.mainText.position = new PIXI.Point(-this.mainText.width / 2, (Settings.STAGE_HEIGHT / 4) -this.mainText.height / 2);
        this.mainText.visible = true;

        var self = this;
        setTimeout(function(){
            self.mainText.visible = false;
        }, Settings.SCORE_MESSAGE_TIMEOUT);

    }

    Messages.prototype.render = function(centerPosition, zoom) {
    	Parent.prototype.render.call(this, centerPosition, 1);
    }
 
    return Messages;
 
});