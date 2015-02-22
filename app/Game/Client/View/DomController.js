define([
    'Game/Config/Settings',
    'Lib/Utilities/NotificationCenter',
    "Lib/Vendor/Stats",
    "Lib/Vendor/Screenfull"
], 

function (Settings, Nc, Stats, Screenfull) {

	"use strict";

    function DomController() {
        this.canvas = document.getElementById("canvas");
        this.debugCanvas = null;
        this.stats = null;
        this.ping = null;

        Nc.on(Nc.ns.client.view.events.ready, this.initDevTools, this);
    }

    DomController.prototype.initDevTools = function() {

        var self = this;

        // create dev tools container
        this.devToolsContainer = document.getElementById("menuBar");

        // create FPS stats
        li = document.createElement("li");
        this.stats = new Stats();
        this.stats.setMode(0);
        li.appendChild(this.stats.domElement);
        this.devToolsContainer.appendChild(li);

        // create debug mode
        li = document.createElement("li");
        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.onclick = function(e) {
            Nc.trigger(Nc.ns.client.view.debugMode.toggle, e.target.checked);
            self.getDebugCanvas().style.display = e.target.checked ? "" : "none";
        }
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode("Debug"));
        li.appendChild(label);
        this.devToolsContainer.appendChild(li);

        // create Ping: container
        this.ping = document.createElement("li");
        this.devToolsContainer.appendChild(this.ping);

                // create Fullscreen
        var li = document.createElement("li");
        li.id = "fullscreen"
        var button = document.createElement("button");
        button.innerHTML = "Fullscreen";
        button.onclick = function() {
            if(Screenfull.enabled) {
                Screenfull.request(self.canvas);
            }
        }
        li.appendChild(button);
        this.devToolsContainer.appendChild(li);

        window.onresize = function() {
            if(Screenfull.enabled) {
                Nc.trigger(Nc.ns.client.view.fullscreen.change, Screenfull.isFullscreen);
            }
        }
    };

    DomController.prototype.statsBegin = function() {
        if(this.stats) {
            this.stats.begin();
        }
    };

    DomController.prototype.statsEnd = function() {
        if(this.stats) {
            this.stats.end();
        }
    };

    DomController.prototype.setPing = function(ping) {
        this.ping.innerHTML = "Ping: " + ping;
    };

    DomController.prototype.getCanvasContainer = function () {
        var container = document.getElementById(Settings.CANVAS_DOM_ID);

        if(container) {
            return container;
        } else {
            throw 'Canvas Container missing: #' + Settings.CANVAS_DOM_ID;
        }
    }

    DomController.prototype.getCanvas = function () {
        return this.canvas;
    }

    DomController.prototype.initCanvas = function (canvas) {
        Nc.trigger(Nc.ns.client.view.fullscreen.change, Screenfull.isFullscreen);
    }

    DomController.prototype.getDebugCanvas = function () {

        if(!this.debugCanvas) {
            var canvas = document.createElement('canvas');
            canvas.width = Settings.STAGE_WIDTH;
            canvas.height = Settings.STAGE_HEIGHT;
            this.debugCanvas = canvas;
            this.getCanvasContainer().appendChild(canvas);
        }

        return this.debugCanvas;
    }

    DomController.prototype.setConnected = function(connected) {
        if(connected) {
            document.body.style.backgroundColor = '';
        } else {
            document.body.style.backgroundColor = '#aaaaaa';
        }
    };


    return new DomController();
    
});