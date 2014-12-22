define([
	"Lib/Vendor/Pixi",
	"Lib/Utilities/NotificationCenter",
	"Game/Config/Settings",
	"Lib/Utilities/ColorConverter"
],
 
function (PIXI, Nc, Settings, ColorConverter) {

	"use strict";
 
    function GameStats(container) {

		this.style = {
			borderWidth: 3,
			padding: 20,
			colors: {
				background: 0x000000,
				text: "red",
				border: 0xAA0000
			}
		};

    	this.container = container;

        this.infoContainer = new PIXI.DisplayObjectContainer();

        var blurFilter = new PIXI.BlurFilter();
        blurFilter.blurX = 12;
        blurFilter.blurY = 12;
        var grayFilter = new PIXI.GrayFilter();
        grayFilter.gray = 0.85;
        this.infoFilters = [blurFilter, grayFilter];

        this.infoText = new PIXI.Text("", {font: "normal 20px monospace", fill: this.style.colors.text, align: "center"});
        this.infoBox = new PIXI.Graphics();
        this.infoBox.alpha = 0.7;

        this.infoContainer.addChild(this.infoBox);
        this.infoContainer.addChild(this.infoText);

        this.infoContainer.visible = false;

        Nc.on(Nc.ns.client.view.gameStats.toggle, this.toggle, this);
    }

    GameStats.prototype.getInfoContainer = function() {
    	return this.infoContainer;
    };
 
    GameStats.prototype.toggle = function(show, sortedPlayers) {
        
        function pad(string, max, alignLeft) {
            string = string.substring(0, max - 1);

            var spaces = new Array( max - string.length + 1 ).join(" ");
            if(alignLeft) {
                return string + spaces;
            } else {
                return spaces + string;
            }
        }

        var string = "" +
                     pad("#", 2, false) + " " +
                     pad("Name", 12, true) +
                     pad("Score", 6, false) +
                     pad("Deaths", 7, false) +
                     pad("Health", 7, false) +
                     "\n-----------------------------------\n";

        var lines = [];
        sortedPlayers.forEach(function(player, i) {
            var name = player.getNickname();
            lines.push(
                pad("" + (i + 1) + ".", 2, false) + " " + 
                pad(name, 12, true) + 
                pad("" + player.stats.score, 6, false) +
                pad("" + player.stats.deaths, 7, false) +
                pad("" + parseInt(player.stats.health, 10), 7, false)
            );
        }, this);

        string += lines.join("\n");


        if(show) {
            this.infoText.setText(string);
            this.infoText.updateText();
            this.infoText.dirty = false;

            var x = Settings.STAGE_WIDTH / 2 - this.infoText.width / 2,
                y = Settings.STAGE_HEIGHT / 2 - this.infoText.height / 2;
            this.infoText.position = new PIXI.Point(x, y);

            this.infoBox.clear();
            this.infoBox.beginFill(this.style.colors.background);
            this.infoBox.lineStyle(this.style.borderWidth, this.style.colors.border);
            this.infoBox.drawRect(0, 0, this.infoText.width - this.style.borderWidth + 2 * this.style.padding * 2, this.infoText.height - this.style.borderWidth + 2 * this.style.padding);
            this.infoBox.endFill();
            this.infoBox.position.x = this.infoText.position.x + this.style.borderWidth/2 - this.style.padding * 2;
            this.infoBox.position.y = this.infoText.position.y + this.style.borderWidth/2 - this.style.padding;

            this.infoContainer.visible = true;
            this.container.filters = this.infoFilters;
            this.infoFilters.forEach(function(filter) { filter.dirty = true; });

            this.drawPlayerColors(sortedPlayers);

        } else {
            this.infoText.setText("...");
            this.infoContainer.visible = false;
            this.container.filters = null;
        }
    }

    GameStats.prototype.drawPlayerColors = function(sortedPlayers) {
    	var converter = new ColorConverter();

    	sortedPlayers.forEach(function(player, i) {

    		this.infoBox.beginFill(converter.getColorByName(player.getNickname()));
    		this.infoBox.lineStyle();
    		this.infoBox.drawRect(this.style.padding, i * 21 + this.style.padding + 42, 16, 16);
    		this.infoBox.endFill();

    	}, this);
    };
 
    return GameStats;
 
});