define([
    "Game/Client/View/Views/AbstractView",
    "Game/Client/View/DomController", 
    "Lib/Vendor/Three", 
    "Game/Config/Settings"
], 

function (Parent, DomController, Three, Settings) {
    
    function ThreeView () {
        Parent.call(this);

        this.mesh = null;
        this.scene = null;
        this.renderer = null;
        this.movableObjects = [];
        this.camera = null;

        this.init();
    }

    ThreeView.prototype = Object.create(Parent.prototype);

    ThreeView.prototype.init = function () {

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

        this.initCamera();

        this.scene = new Three.Scene();
        this.scene.add(this.camera);

        var ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        this.setCanvas(this.renderer.domElement);
    }

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
                    self.addMesh(mesh);
                    //console.log("img height:", mesh.material.map.image.height);
                    //mesh.rotation.z = rad;
                });
            })();
        };
    };

    ThreeView.prototype.render = function () {
        
        if(this.me) {
            var pos = this.calculateCameraPosition();
            this.setCameraPosition(pos.x, pos.y);
        }

        for (var i = 0; i < this.movableObjects.length; i++) {
            var obj = this.movableObjects[i];
            var pos = obj.player.getPosition();
            obj.mesh.position.x = pos.x * Settings.RATIO;
            obj.mesh.position.y = -pos.y * Settings.RATIO + 21;
        }

        this.renderer.render(this.scene, this.camera);
    }

    ThreeView.prototype.addMesh = function(mesh) {
        this.scene.add(mesh);
    };

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

    ThreeView.prototype.updateMesh = function(mesh, options) {
        if (options.x) mesh.position.x = options.x;
        if (options.y) mesh.position.y = options.y;
        if (options.rotation) mesh.rotation.z = options.rotation * (Math.PI / 180);
        if (options.xScale) mesh.width *= options.xScale;
        if (options.yScale) mesh.height *= options.yScale;
        if (options.width) mesh.width = options.width;
        if (options.height) mesh.height = options.height;
    };


    ThreeView.prototype.addPlayer = function(player) {
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

    ThreeView.prototype.initCamera = function () {
        this.zoom = 1;

        this.camera = new Three.OrthographicCamera(
            -Settings.STAGE_WIDTH/2, 
            Settings.STAGE_WIDTH/2, 
            Settings.STAGE_HEIGHT/2, 
            -Settings.STAGE_HEIGHT/2, 
            0, 
            1000 
        );

        this.camera.position.z = 1;
        this.setCameraPosition(Settings.STAGE_WIDTH / 2, -Settings.STAGE_HEIGHT / 2);
    }

    ThreeView.prototype.setCameraPosition = function (x, y) {
        this.camera.position.x = x;
        this.camera.position.y = y;
    };

    ThreeView.prototype.setCameraZoom = function (z) {
        this.zoom = z;
        z *= 2;
        console.log(this.zoom)
        this.camera.left   = - Settings.STAGE_WIDTH / z;
        this.camera.right  =   Settings.STAGE_WIDTH / z;
        this.camera.top    =   Settings.STAGE_HEIGHT / z;
        this.camera.bottom = - Settings.STAGE_HEIGHT / z;
        this.camera.updateProjectionMatrix();
    };

    return ThreeView;
});