define([
    'Game/Config/Settings',
    'Lib/Utilities/NotificationCenter',
    "Lib/Vendor/Stats",
    "Lib/Vendor/Screenfull"
], 

function (Settings, Nc, Stats, Screenfull) {

    function DomController() {
        this.canvas = null;
        this.debugCanvas = null;
        this.stats = null;
        this.ping = null;

        Nc.on(Nc.ns.client.view.events.ready, this.initDevTools, this);
    }

    DomController.prototype.initDevTools = function() {

        var self = this;

        // create dev tools container
        this.devToolsContainer = document.createElement("div");
        this.devToolsContainer.id = "devtools";
        document.body.appendChild(this.devToolsContainer);

        // create Fullscreen
        var p = document.createElement("p");
        var button = document.createElement("button");
        button.innerHTML = "Fullscreen";
        button.onclick = function() {
            if(Screenfull.enabled) {
                Screenfull.request(self.canvas);
            }
        }
        p.appendChild(button);
        this.devToolsContainer.appendChild(p);

        window.onresize = function() {
            if(Screenfull.enabled) {
                Nc.trigger("view/fullscreenChange", Screenfull.isFullscreen);
            }
        }

        // create Ping: container
        this.ping = document.createElement("span");
        this.devToolsContainer.appendChild(this.ping);

        // create FPS stats
        this.stats = new Stats();
        this.stats.setMode(0);
        this.devToolsContainer.appendChild(this.stats.domElement);
        
        // create Reset level
        p = document.createElement("p");
        button = document.createElement("button");
        button.innerHTML = "Reset level";
        button.onclick = function() {
            inspector.resetLevel();
            button.disabled = true;;
            setTimeout(function() {
                button.disabled = false;
            }, 1000 * 30);
        }
        p.appendChild(button);
        this.devToolsContainer.appendChild(p);

        // create debug mode
        var label = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.onclick = function(e) {
            Nc.trigger("view/toggleDebugMode", e.target.checked);
            self.getDebugCanvas().style.display = e.target.checked ? "" : "none";
        }
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode("Debug"));
        this.devToolsContainer.appendChild(label);

        // create health
        this.health = document.createElement("span");
        this.health.innerHTML = "Health: 100";
        p = document.createElement("p");
        p.appendChild(this.health);
        this.devToolsContainer.appendChild(p);
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

    DomController.prototype.setCanvas = function (canvas) {
        
        var container = this.getCanvasContainer();
        if(this.canvas) {
            container.removeChild(this.canvas);
        }

        this.canvas = canvas;
        container.appendChild(canvas);
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

    DomController.prototype.setHealth = function(health) {
        this.health.innerHTML = "Health: " + parseInt(health, 10);     
    };


    return new DomController();
    
});