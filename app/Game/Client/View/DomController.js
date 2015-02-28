define([
    'Game/Config/Settings',
    'Lib/Utilities/NotificationCenter',
    "Lib/Vendor/Stats",
    "Lib/Vendor/Screenfull",
    "Game/Client/View/Graph",
    "Game/Client/PointerLockManager"
], 

function (Settings, Nc, Stats, Screenfull, Graph, PointerLockManager) {

	"use strict";

    function DomController() {
        this.canvas = document.getElementById("canvas");
        this.debugCanvas = null;
        this.stats = null;
        this.ping = null;
        this.nickContainer = null;

        this.devToolsContainer = document.getElementById("menuBar");

        this.initDevTools();
    }

    DomController.prototype.initDevTools = function() {

        var self = this;
        var li, button, label;

        // create back to menu button
        li = document.createElement("li");
        li.id = "back-to-menu";
        button = document.createElement("button");
        button.innerHTML = "Menu";
        button.onclick = function() {
            window.location.href="/";
        }
        li.appendChild(button);
        this.devToolsContainer.appendChild(li);

        // create user name
        li = document.createElement("li");
        label = document.createElement("label");
        label.appendChild(document.createTextNode("?"));
        li.appendChild(label);
        this.devToolsContainer.appendChild(li);
        this.nickContainer = label;

        // create new fps meter
        li = document.createElement("li");
        var fpsCanvas = document.createElement("canvas");
        fpsCanvas.id = "graph-fps";
        fpsCanvas.width = "100";
        fpsCanvas.height = "27";
        li.appendChild(fpsCanvas);
        this.devToolsContainer.appendChild(li);

        this.fpsGraph = new Graph(fpsCanvas.getContext("2d"));

        li = document.createElement("li");
        label = document.createElement("label");
        label.id = "label-fps";
        label.innerHTML = "FPS:0";
        li.appendChild(label);
        this.devToolsContainer.appendChild(li);


        // create old FPS stats
        /*
        li = document.createElement("li");
        this.stats = new Stats();
        this.stats.setMode(0);
        li.appendChild(this.stats.domElement);
        this.devToolsContainer.appendChild(li);
        */

        // create Ping: container
        li = document.createElement("li");
        this.ping = document.createElement("label");
        li.appendChild(this.ping);
        this.devToolsContainer.appendChild(li);


        // create debug mode
        li = document.createElement("li");
        label = document.createElement("label");
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


        // create Fullscreen
        li = document.createElement("li");
        li.id = "fullscreen"
        button = document.createElement("button");
        button.innerHTML = "Fullscreen";
        button.onclick = function() {
            if(Screenfull.enabled) {
                PointerLockManager.request();
                Screenfull.request(self.canvas);
            }
        }
        li.appendChild(button);
        this.devToolsContainer.appendChild(li);


        // FIXME : isn't this a weird place for this?
        window.onresize = function() {
            Nc.trigger(Nc.ns.client.view.display.change);
        }
    };

    DomController.prototype.setNick = function (nick) {
        this.nickContainer.innerHTML = nick
    }

    DomController.prototype.statsBegin = function() {
        /*
        if(this.stats) {
            this.stats.begin();
        }
        */
    };

    DomController.prototype.statsEnd = function() {

        /*
        if(this.stats) {
            this.stats.end();
        }
        */
        this.fpsGraph.step();
    };

    DomController.prototype.setPing = function(ping) {
        this.ping.innerHTML = "Ping:" + ping;
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
        Nc.trigger(Nc.ns.client.view.display.change, Screenfull.isFullscreen);
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