define([
    "Game/Client/View/Views/AbstractView",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Pixi", 
    "Game/Config/Settings"
], 

function (Parent, DomController, PIXI, Settings) {
    
    function PixiView () {

        Parent.call(this);

        this.movableObjects = [];
        this.camera = null;
        this.stage = null;
        this.container = null;
        this.init();
    }

    PixiView.prototype = Object.create(Parent.prototype);

    PixiView.prototype.init = function () {

        if(Settings.USE_WEBGL) {
            this.renderer = new PIXI.WebGLRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);
        } else {
            this.renderer = new PIXI.CanvasRenderer(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);
        }

        this.stage = stage = new PIXI.Stage(0x333333);
        
        this.initCamera();

        this.setCanvas(this.renderer.view);
    }

    PixiView.prototype.loadMeshes = function(objects) {
        var self = this;
        for (var i = 0; i < objects.length; i++) {
            (function() {
                var o = objects[i];
                var x = o.x * Settings.TILE_SIZE;
                var y = o.y * Settings.TILE_SIZE;
                var r = o.r ? o.r : 0;
                var rad = 0.5 * Math.PI * -r;

                var material = self.tileAtPositionExists(objects, o.x, o.y -1) ? "Soil" : "GrassSoil";
                var callback = function(mesh) {
                    self.addMesh(mesh);
                    //console.log("img height:", mesh.material.map.image.height);
                    //mesh.rotation.z = rad;
                };
                self.createMesh(Settings.TILE_SIZE, Settings.TILE_SIZE, x, y, 'static/img/Tiles/' + material + '/' + o.s + '' + o.r + '.gif', callback, true);
            })();
        };
    };

    PixiView.prototype.render = function () {
        if(this.me) {
            var pos = this.calculateCameraPosition();
            this.setCameraPosition(pos.x, pos.y);
        }

        /*
        for (var i = 0; i < this.movableObjects.length; i++) {
            var obj = this.movableObjects[i];
            var pos = obj.player.getPosition();
            obj.mesh.position.x = pos.x * Settings.RATIO + 4 ;
            obj.mesh.position.y = pos.y * Settings.RATIO - 34; // weirdly a different magic number as for three
        }
        */

        this.renderer.render(this.stage);
    }

    PixiView.prototype.addMesh = function(mesh) {
        this.container.addChild(mesh);
    };

    PixiView.prototype.createMesh = function (width, height, x, y, imgPath, callback) {

        var texture = PIXI.Texture.fromImage(imgPath);

        var mesh = new PIXI.Sprite(texture);
        mesh.width = width;
        mesh.height = height;
        mesh.position.x = x;
        mesh.position.y = y;

        callback(mesh);
    }

    PixiView.prototype.updateMesh = function(mesh, options) {
        if (options.x) mesh.position.x = options.x;
        if (options.y) mesh.position.y = options.y;
        if (options.rotation) mesh.rotation = options.rotation;
        if (options.xScale) mesh.scale.x = options.xScale;
        if (options.yScale) mesh.scale.y = options.yScale;
        if (options.width) mesh.width = options.width;
        if (options.height) mesh.height = options.height;
    };

    PixiView.prototype.addPlayer = function(player) {
        var self = this;
        var mesh = null;
        var pos = player.getPosition();
        var size = {w:10, h:42};
        var callback = function(mesh) {
            self.addMesh(mesh);
            self.movableObjects.push({
                player: player,
                mesh: mesh
            });
        }
        this.createMesh(size.w, size.h, pos.x, pos.y, "static/img/Characters/Chuck/chuck.png", callback, false);
    };

    PixiView.prototype.removPlayer = function(player) {
        // nothing
    };

    PixiView.prototype.initCamera = function () {
        this.container = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.container);
    }

    PixiView.prototype.calculateCameraPosition = function() {
        var reference = this.me.getPosition();
        var pos = {};

        pos.x = -reference.x;
        pos.y = reference.y;

        pos.x = pos.x * Settings.RATIO;
        pos.y = -(pos.y * Settings.RATIO);

        pos.x -= this.me.playerController.xyInput.x * Settings.STAGE_WIDTH / 4;
        pos.y += this.me.playerController.xyInput.y * Settings.STAGE_HEIGHT / 4;

        return pos;
    };

    PixiView.prototype.setCameraPosition = function (x, y) {
        this.container.position.x = x + Settings.STAGE_WIDTH / 2;
        this.container.position.y = y + Settings.STAGE_HEIGHT / 2;
    };

    PixiView.prototype.setCameraZoom = function (z) {
        //this.container.position.x = x;
        //this.container.position.y = y; 
    };

    return PixiView;
});
