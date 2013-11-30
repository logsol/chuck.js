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
            antialias: true,
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


        this.createMesh(100, 100, 100, 100, 'static/img/100.png', function (mesh) {
            self.mesh = mesh;
            self.scene.add(mesh);
        });
/*
         this.createMesh(50, 50, 200, 100, 'static/img/100.png', function (mesh) {
            self.scene.add(mesh);
        });
*/

        //this.animate(this);
    }

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

        this.renderer.render(this.scene, this.cameraController.getCamera());
    }

    ViewController.prototype.createMesh = function (width, height, x, y, imgPath, callback) {
        var textureImg = new Image();
        textureImg.onload = function () { // FIXME: perhaps not needed to load double?
            var material = new Three.MeshLambertMaterial({
                map: Three.ImageUtils.loadTexture(imgPath),
                transparent: true
            });

            var mesh = new Three.Mesh(new Three.PlaneGeometry(width, height), material);
            mesh.overdraw = true;
            //mesh.position.z = 1;
            mesh.position.x = x;
            mesh.position.y = y;
            
            callback(mesh);
        };
        textureImg.src = imgPath;
    }

    return ViewController;
});