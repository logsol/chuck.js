define([
    "Game/Client/View/ViewController",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Three", 
    "Game/Config/Settings", 
    "Game/Client/View/CameraController"
], 

function (Parent, DomController, Three, Settings, CameraController) {
    
    function ThreeView () {

        Parent.call(this);
    }

    ThreeView.prototype = Object.create(Parent.prototype);

    ThreeView.prototype.init = function () {

        //Parent.prototype.init.call(this);

        var self = this;

        var rendererOptions = {
            antialias: false,
            preserveDrawingBuffer: true
        };

        if(Settings.USE_WEBGL) {
            this.renderer = new Three.WebGLRenderer(rendererOptions);
        } else {
            this.renderer = new Three.CanvasRenderer(rendererOptions);
        }
        
        this.renderer.setClearColor("#333333", 1);
        this.renderer.setSize(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);

        DomController.setCanvas(this.renderer.domElement);

        if(Settings.DEBUG_MODE) {
            DomController.createDebugCanvas();
        }

        this.scene = new Three.Scene();
        this.scene.add(this.cameraController.getCamera());


        var ambientLight = new Three.AmbientLight(0xffaaaa);
        this.scene.add(ambientLight);



        //var directionalLight = new Three.DirectionalLight(0xffffff);
        //directionalLight.position.set(1, 0, 10).normalize();
        //this.scene.add(directionalLight);


        //this.createMesh(100, 100, 100, 100, 'static/img/100.png', function (mesh) {
        //    self.mesh = mesh;
        //    self.scene.add(mesh);
        //});
    }

    ThreeView.prototype.loadPlayerMesh = function(player) {
        
    };

    ThreeView.prototype.loadMeshes = function(objects) {
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

    ThreeView.prototype.tileAtPositionExists = function(objects, x, y) {

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            if(o.x == x && o.y == y) return true;
        }
        return false;
    };

    ThreeView.prototype.render = function () {
        
        if(this.me) {
            var pos = this.me.getPosition();
            var x = pos.x * Settings.RATIO;
            var y = -(pos.y * Settings.RATIO);

            x += this.me.playerController.xyInput.x * Settings.STAGE_WIDTH / 4;
            y += this.me.playerController.xyInput.y * Settings.STAGE_HEIGHT / 4;

            this.cameraController.setPosition(x, y);
        }

        for (var i = 0; i < this.movableObjects.length; i++) {
            var obj = this.movableObjects[i];
            var pos = obj.player.getPosition();
            obj.mesh.position.x = pos.x * Settings.RATIO;
            obj.mesh.position.y = -pos.y * Settings.RATIO + 21;
        }

        this.renderer.render(this.scene, this.cameraController.getCamera());
    }

    ThreeView.prototype.createMesh = function (width, height, x, y, imgPath, callback) {
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
    }

    ThreeView.prototype.setMe = function(player) {
        this.me = player;
    };

    ThreeView.prototype.addPlayer = function(player) {
        var self = this;
        var mesh = null;
        var pos = player.getPosition();
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

    ThreeView.prototype.removPlayer = function(player) {
        for (var i = 0; i < this.movableObjects.length; i++) {
            var o = this.movableObjects[i];
            if(o.player == player) {
                this.scene.remove(o.mesh);
            }
        };
    };

    return ThreeView;
});