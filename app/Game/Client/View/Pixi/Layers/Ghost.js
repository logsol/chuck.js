define([
	"Game/Client/View/Pixi/Layer",
	"Lib/Vendor/Pixi",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings"
],
 
function (Parent, PIXI, nc, Settings) {

	"use strict";
 
    function Ghost() {
    	Parent.call(this, "ghost", {parallaxSpeed: 0});

		this.ncTokens = this.ncTokens.concat([
            nc.on(nc.ns.client.view.layer.levelSizeUpdate, this.onLevelSizeUpdate, this),
            nc.on(nc.ns.client.view.playerArrow.createAndAdd, this.onCreateAndAddPlayerArrow, this),
            nc.on(nc.ns.client.view.playerArrow.update, this.onUpdatePlayerArrow, this),
            nc.on(nc.ns.client.view.healthBar.createAndAdd, this.onCreateAndAddHealthBar, this),
            nc.on(nc.ns.client.view.healthBar.update, this.onUpdateHealthBar, this),
            nc.on(nc.ns.client.view.healthBar.remove, this.onRemoveHealthBar, this),
        ]);

    }

    Ghost.prototype = Object.create(Parent.prototype);

    Ghost.prototype.onLevelSizeUpdate = function(levelSize) {
        this.position.current.x = -levelSize.width / 2;
        this.position.current.y = -levelSize.height / 2;  
    };
 
    Ghost.prototype.onCreateAndAddPlayerArrow = function(callback, options) {

        var arrow = new PIXI.Graphics();
        arrow.visible = false;
        this.container.addChild(arrow);

        var width = 10,
            height = 10;

        arrow.beginFill(0xffffff, 0.4);
        arrow.lineStyle(0, 0x000000);
        arrow.moveTo(0, 0);
        arrow.lineTo(width, 0);
        arrow.lineTo(width / 2, height);
        arrow.endFill();
        arrow.pivot = new PIXI.Point(width/2, height/2);
        arrow.visible = true;

        this.onUpdatePlayerArrow(arrow, options);

        callback(arrow);
    };

    Ghost.prototype.onUpdatePlayerArrow = function(arrow, options) {

        var offsetX = 0,
            offsetY = -55,
            x = offsetX + options.x,
            y = offsetY + options.y;

        var target = new PIXI.Point(x, y);

        arrow.position.x += (target.x -arrow.position.x) * Settings.ARROW_GLIDE / 1.5 / 100;
        arrow.position.y += (target.y -arrow.position.y) * Settings.ARROW_GLIDE / 100;

        var angle = -Math.atan2(arrow.position.x - x, arrow.position.y - options.y);
        angle += 0.785398163 * 4;

        arrow.rotation = angle;
    };

        // Player Info

    Ghost.prototype.onCreateAndAddHealthBar = function(callback, options) {
        var healthBar = new PIXI.Graphics();
        this.container.addChild(healthBar);

        this.onUpdateHealthBar(healthBar, options);
        callback(healthBar);
    };

    Ghost.prototype.onUpdateHealthBar = function(healthBar, options) {
        var width = 14,
            height = 2,
            borderWidth = 1,
            offsetX = -8,
            offsetY = -52;

        if(typeof options.healthFactor != 'undefined') {
            healthBar.clear();

            healthBar.beginFill(0x000000);
            healthBar.lineStyle(borderWidth, 0x000000);
            healthBar.drawRect(0, 0, width, height);
            healthBar.endFill();

            if(options.healthFactor > 0) {
                var color = 0x00FF00;
                if(options.healthFactor < Settings.CRITICAL_HEALTH_THRESHOLD) color = 0xFF0000;
                healthBar.beginFill(color);
                healthBar.lineStyle(0, 0x000000);
                healthBar.drawRect(borderWidth, borderWidth, width * options.healthFactor, height);
                healthBar.endFill();
            }
        }

        if (options.x && options.y) healthBar.position = new PIXI.Point(offsetX + options.x, offsetY + options.y);
        if (options.visible === true || options.visible === false) healthBar.visible = options.visible;
    };

    Ghost.prototype.onRemoveHealthBar = function(healthBar) {
        this.container.removeChild(healthBar);
    };
 
    return Ghost;
 
});