define([
	"Lib/Vendor/Pixi",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings",
	"Lib/Utilities/ColorConverter"
],
 
function (PIXI, Nc, Settings, ColorConverter) {

	"use strict";
 
    function GameStats(view) {

		this.style = {
			borderWidth: 3,
			padding: 20,
			colors: {
				background: 0x000000,
				text: "red",
                headline: "#880000",
				border: 0xAA0000
			},
            line: {
                height: 16,
                spacing: 5
            },
            fontSize: 12
		};

    	this.view = view;

        this.container = new PIXI.DisplayObjectContainer();

        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blurX = 12;
        blurFilter.blurY = 12;
        var grayFilter = new PIXI.GrayFilter();
        grayFilter.gray = 0.85;
        this.filters = [blurFilter, grayFilter];

        this.background = new PIXI.Graphics();
        this.background.alpha = 0.7;
        this.container.addChild(this.background);

        this.dialog = new PIXI.DisplayObjectContainer();
        this.container.addChild(this.dialog);

        this.graphics = new PIXI.Graphics();

        /*
            gameContainer
                filters
            container
                background
                dialog
                    graphics
                        playerColor
                    headline
                    line
        */

        this.container.visible = false;
        this.sortedPlayers = [];

        this.ncTokens = [
            Nc.on(Nc.ns.client.view.gameStats.toggle, this.toggle, this),
            Nc.on(Nc.ns.client.view.gameStats.update, this.update, this)
        ];
    }

    GameStats.prototype.getInfoContainer = function() {
    	return this.container;
    };
 
    GameStats.prototype.toggle = function(show) {
        if(show) {
            this.redraw();
            // show stats with filters
            this.container.visible = true;

            this.view.addFilters(this.filters);
            this.filters.forEach(function(filter) { filter.dirty = true; });
        } else {
            this.container.visible = false;
            this.view.removeFilters(this.filters);
        }
    }

    GameStats.prototype.update = function(sortedPlayers) {
        this.sortedPlayers = sortedPlayers;
        this.redraw();
    };

    GameStats.prototype.redraw = function() {
        this.background.clear();
        this.graphics.clear();
        this.dialog.removeChildren();

        // redraw background
        this.background.beginFill(this.style.colors.background);
        this.background.drawRect(0, 0, Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);
        this.background.endFill();

        // redraw text and graphics

        var string = "" +
                     "  #".pad(7, true) + " " +
                     "Name".pad(12, true) +
                     "Score".pad(6, false) +
                     "Deaths".pad(7, false) +
                     "Health".pad(9, false) + " ";

        var line = new PIXI.Text(string, {
            font: "normal " + this.style.fontSize + "px 'Joystix'",
            fill: this.style.colors.headline
        });

        line.position = new PIXI.Point(0, 0);
        this.dialog.addChild(line);

        this.drawPlayers(this.sortedPlayers);

        var x = Settings.STAGE_WIDTH / 2 - this.dialog.getBounds().width / 2,
            y = Settings.STAGE_HEIGHT / 2 - (this.sortedPlayers.length + 1) * (this.style.line.height + this.style.line.spacing) / 2;
        this.dialog.position = new PIXI.Point(x, y);

        this.dialog.addChild(this.graphics);
    };

    GameStats.prototype.drawPlayers = function(sortedPlayers) {
        sortedPlayers.forEach(function(player, i) {

            this.drawPlayer(player, i + 1);
            this.drawPlayerGraphics(player, i + 1)

        }, this);
    };

    GameStats.prototype.drawPlayer = function(player, i) {
        var string = (i + ".   ").pad(7, false) + " " + 
            player.getNickname().pad(12, true) + 
            ("" + player.stats.score).pad(6, false) +
            ("" + player.stats.deaths).pad(7, false) +
            ("" /* + parseInt(player.stats.health, 10)*/).pad(9, false) + " ";

        var line = new PIXI.Text(string, {
            font: "normal " + this.style.fontSize + "px 'Joystix'",
            fill: this.style.colors.text
        });

        line.position = new PIXI.Point(
            0,
            i * (this.style.line.height + this.style.line.spacing)
        );

        this.dialog.addChild(line);
    };

    GameStats.prototype.drawPlayerGraphics = function(player, i) {
        var converter = new ColorConverter();

        // draw shirt color
        this.graphics.beginFill(converter.getColorByName(player.getNickname()));
        this.graphics.drawRect(
            50, 
            i * (this.style.line.height + this.style.line.spacing),
            this.style.line.height, 
            this.style.line.height
        );

        // draw health bar
        var height = this.style.line.height / 2,
            width = height * 7,
            borderWidth = 2,
            offsetX = 360,
            offsetY = (i * (this.style.line.height + this.style.line.spacing)) + ((this.style.line.height - height) / 2);

        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(offsetX, offsetY, width, height);
        this.graphics.endFill();

        if(player.stats.health > 0) {
            var color = player.stats.health / 100 < Settings.CRITICAL_HEALTH_THRESHOLD
                ? 0xFF0000
                : 0x00FF00;

            this.graphics.beginFill(color);
            this.graphics.drawRect(
                offsetX + borderWidth, 
                offsetY + borderWidth, 
                width * player.stats.health / 100 - 2 * borderWidth, 
                height - 2 * borderWidth
            );
            this.graphics.endFill();
        }
    };

    GameStats.prototype.destroy = function() {
        for (var i = 0; i < this.ncTokens.length; i++) {
            Nc.off(this.ncTokens[i]);
        };
    };
 
    return GameStats;
 
});