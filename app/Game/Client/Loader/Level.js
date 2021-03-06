define([
	"Game/Core/Loader/Level",
	"Game/Config/Settings",
    "Lib/Utilities/NotificationCenter",
    "Lib/Vendor/Pixi",
    "Game/Client/View/Abstract/Layer"
],

function (Parent, Settings, nc, PIXI, AbstractLayer) {

	"use strict";

    function Level (uid, engine, gameObjects) {
        Parent.call(this, uid, engine, gameObjects);
        this.levelSize = {
            width: 0,
            height: 0
        }
    }

    Level.prototype = Object.create(Parent.prototype);

    Level.prototype.loadLevelDataFromPath = function (path, callback) {
    	var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    self.loadAssets(JSON.parse(xhr.responseText), callback);
                } else {
                    console.error("Ajax error: " + xhr.status + " " + xhr.statusText)
                }
            }
        }
        xhr.open("GET", path, true);
        xhr.send(null);
    }

    Level.prototype.loadAssets = function(levelData, callback) {

        var paths = this.getAssetPaths(levelData);

        var count = 0;
        var numPaths = paths.length;
        var loader = new PIXI.AssetLoader(paths);
        loader.onComplete = function() { callback(levelData); };
        loader.onProgress = function() { 
            var progress = parseInt(100 / numPaths * ++count, 10) + 1;
            nc.trigger(nc.ns.client.view.preloadBar.update, progress);
        }
        loader.load();
    };

    Level.prototype.getAssetPaths = function(levelData) {

        var paths = [];

        // Get chuck
        var padF = function(n) {
            if(n<10) return "00" + n;
            if(n<100) return "0" + n;
            return n;
        }

        /* 
        // Single File Animations Preloading
        var animationSets = ["WithArms", "WithoutArms"];
        var addition = "";
        
        for (var i = 0; i < characterNames.length; i++) {
            var characterName = characterNames[i];
            for (var j = 1; j <= 126; j++) {
                for (var k = 0; k < animationSets.length; k++) {
                    var animationSet = animationSets[k];
                    paths.push(
                        Settings.GRAPHICS_PATH 
                        + Settings.GRAPHICS_SUBPATH_CHARACTERS 
                        + characterName 
                        + "/Animation/"
                        + animationSet
                        + "/ChuckAnimations0" 
                        + padF(j) 
                        + ".png"
                    );
                };
            };
        };
        */

        var characterNames = ["Chuck"];
        var characterName = characterNames[0];

        paths.push(
            Settings.GRAPHICS_PATH
            + Settings.GRAPHICS_SUBPATH_CHARACTERS
            + characterName
            + "/Animation/"
            + "/TexturePacker"
            + "/chuck_sheet.json"
        );

        paths.push(
            Settings.GRAPHICS_PATH 
            + Settings.GRAPHICS_SUBPATH_CHARACTERS 
            + characterName
            + "/head.png"
        );

        return paths;
    };

    Level.prototype.setupLayer = function(options, behind, referenceId) {

        Parent.prototype.setupLayer.call(this, options, behind, referenceId);
        var parallaxSpeed = 0.0; // default parallax
        if (options.properties && options.properties.parallaxSpeed) {
            parallaxSpeed = parseFloat(options.properties.parallaxSpeed);
        } 
        nc.trigger(
            nc.ns.client.view.layer.createAndInsert,
            options.layerId,
            {
                parallaxSpeed: parallaxSpeed,
                levelSize: this.levelSize
            },
            behind,
            referenceId
        );
    };

    return Level;
});