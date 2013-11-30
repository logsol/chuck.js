var requires = [
    "Game/Client/View/DomController", 
    "Lib/Vendor/Three", 
    "Game/Config/Settings", 
    "Game/Client/View/CameraController"
];

define(requires, function (DomController, Three, Settings, CameraController) {
    
    function ViewController () {

        this.mesh = null;
        this.scene = null;
        this.renderer = null;
        this.cameraController = new CameraController();
        this.movableObjects = [];

        this.init();
    }

    function isWebGlEnabled () { 
        try { 
            return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); 
        } catch(e) { 
            return false; 
        } 
    }

    ViewController.prototype.init = function () {

        var self = this;

        var rendererOptions = {
            antialias: false,
            preserveDrawingBuffer: true
        };

        //if(isWebGlEnabled()) {
            this.renderer = new Three.WebGLRenderer(rendererOptions);
        //} else {
            //this.renderer = new Three.CanvasRenderer(rendererOptions);
        //}
        
        this.renderer.setClearColor("#333333", 1);
        this.renderer.setSize(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);

        DomController.setCanvas(this.renderer.domElement);

        if(Settings.DEBUG_MODE) {
            DomController.createDebugCanvas();
        }

        this.scene = new Three.Scene();
        this.scene.add(this.cameraController.getCamera());


        var ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        //var directionalLight = new Three.DirectionalLight(0xffffff);
        //directionalLight.position.set(1, 0, 10).normalize();
        //this.scene.add(directionalLight);


        //this.createMesh(100, 100, 100, 100, 'static/img/100.png', function (mesh) {
        //    self.mesh = mesh;
        //    self.scene.add(mesh);
        //});
    }

    ViewController.prototype.loadPlayerMesh = function(player) {
        
    };

    ViewController.prototype.loadMeshes = function(objects) {
        var self = this;
        for (var i = 0; i < objects.length; i++) {
            (function() {
                var o = objects[i];
                var x = o.x * Settings.TILE_SIZE;
                var y = (-o.y) * Settings.TILE_SIZE;
                var r = o.r ? o.r : 0;
                var rad = 0.5 * Math.PI * -r;

                var material = self.tileAtPositionExists(objects, o.x, o.y -1) ? "Soil" : "GrassSoil";
                
                self.createMesh(Settings.TILE_SIZE, Settings.TILE_SIZE, x, y, 'static/img/Tiles/' + material + '/' + o.s + '' + o.r + '.gif', function(mesh) {
                    self.scene.add(mesh);
                    //console.log("img height:", mesh.material.map.image.height);
                    //mesh.rotation.z = rad;
                });
            })();
        };
    };

    ViewController.prototype.tileAtPositionExists = function(objects, x, y) {

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            if(o.x == x && o.y == y) return true;
        }
        return false;
    };

    ViewController.prototype.update = function () {
        this.render();
    }

    ViewController.prototype.render = function () {
        if(this.mainPlayer) {
            var pos = this.mainPlayer.getDoll().getBody().GetPosition();
            this.cameraController.setPosition(pos.x * Settings.RATIO, -(pos.y * Settings.RATIO));
        }

        for (var i = 0; i < this.movableObjects.length; i++) {
            var obj = this.movableObjects[i];
            var pos = obj.player.getDoll().getBody().GetPosition();
            obj.mesh.position.x = pos.x * Settings.RATIO;
            obj.mesh.position.y = -pos.y * Settings.RATIO + 21;
        }

        this.renderer.render(this.scene, this.cameraController.getCamera());
    }

    ViewController.prototype.createMesh = function (width, height, x, y, imgPath, callback) {
        var mesh;
        var material = new Three.MeshLambertMaterial({
            map: Three.ImageUtils.loadTexture(imgPath, new THREE.UVMapping(), function(){
                callback(mesh);
            }),
            transparent: true
        });

        mesh = new Three.Mesh(new Three.PlaneGeometry(width, height), material);
        mesh.overdraw = true;
        mesh.position.x = x;
        mesh.position.y = y;
        //mesh.position.z = 1;
    }

    ViewController.prototype.setMainPlayer = function(player) {
        this.mainPlayer = player;
    };

    ViewController.prototype.addMovablePlayer = function(player) {
        var self = this;
        var mesh = null;
        var pos = player.getDoll().getBody().GetPosition();
        var size = {w:10, h:42};
        var callback = function(mesh) {
            self.scene.add(mesh);
            self.movableObjects.push({
                player: player,
                mesh: mesh
            });            
        }
        this.createMesh(size.w, size.h, pos.x, pos.y, "static/img/Characters/Chuck/chuck.png", callback);

    };

    return ViewController;
});