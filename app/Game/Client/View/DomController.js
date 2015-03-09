define([
    'Game/Config/Settings',
    'Lib/Utilities/NotificationCenter',
    "Lib/Vendor/Screenfull",
    "Game/Client/View/Graph",
    "Game/Client/PointerLockManager"
], 

function (Settings, Nc, Screenfull, Graph, PointerLockManager) {

	"use strict";

    function DomController() {
        this.canvas = null;
        this.stats = null;
        this.ping = null;
        this.nickContainer = null;
        this.fpsContainer = "";
        this.devToolsContainer = null;

        this.initDevTools();
    }

    DomController.prototype.initDevTools = function() {

        var self = this;
        var li, button, label;

        this.canvas = document.getElementById("canvas");
        this.devToolsContainer = document.getElementById("menuBar");

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

        this.fpsGraph = new Graph(fpsCanvas.getContext("2d"), true);

        // create fps label with updater
        li = document.createElement("li");
        label = document.createElement("label");
        label.id = "label-fps";
        li.appendChild(label);
        this.devToolsContainer.appendChild(li);
        this.fpsContainer = label;

        this.fpsGraph.onUpdate(function(value){
            self.fpsContainer.innerHTML = "FPS:" + value;

            var color, 
                alpha = 0.8;

            if (value >= 50) {
                color = "rgba(136, 209, 018, " + alpha +  ")";
            } else if (value > 25) {
                color = "rgba(204, 114, 018, " + alpha +  ")";
            } else {
                color = "rgba(224, 018, 018, " + 1 +  ")";
            }

            return color;
        });

        // create new ping meter
        li = document.createElement("li");
        var pingCanvas = document.createElement("canvas");
        pingCanvas.id = "graph-fps";
        pingCanvas.width = "100";
        pingCanvas.height = "27";
        li.appendChild(pingCanvas);
        this.devToolsContainer.appendChild(li);

        this.pingGraph = new Graph(pingCanvas.getContext("2d"), false, {
            scaleOverride: false, 
            scaleStartValue: 0, 
            scaleStepWidth: 0, 
            scaleSteps: 0
        })

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


    DomController.prototype.fpsStep = function() {
        this.fpsGraph.step();
    };

    DomController.prototype.setPing = function(ping) {
        this.ping.innerHTML = "Ping:" + ping;
        this.pingGraph.addValue(ping);
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

    DomController.prototype.setConnected = function(connected) {
        if(connected) {
            document.body.style.backgroundColor = '';
        } else {
            document.body.style.backgroundColor = '#aaaaaa';
            this.ping.innerHTML = "Disconnected. ".replace(/ /g, '&nbsp;');
            this.ping.style.color = "#ff0000";

            self = this;
            setTimeout(function(){self.ping.innerHTML = "Reload Page...".replace(/ /g, '&nbsp;');}, 3000);
            setTimeout(function(){self.ping.innerHTML = "Reload in 3...".replace(/ /g, '&nbsp;');}, 6000);
            setTimeout(function(){self.ping.innerHTML = "Reload in 2...".replace(/ /g, '&nbsp;');}, 7000);
            setTimeout(function(){self.ping.innerHTML = "Reload in 1...".replace(/ /g, '&nbsp;');}, 8000);
            setTimeout(function(){self.ping.innerHTML = "Reload now.   ".replace(/ /g, '&nbsp;'); location.reload(); }, 9000);
        }
    };


    return new DomController();
    
});