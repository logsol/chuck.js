define(["Client/Dom", "Vendor/Three", "Chuck/Settings", "Chuck/View/CameraController"], function(Dom, Three, Settings, CameraController){
	
	function ViewController(){

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

	ViewController.prototype.init = function(){

		var self = this;

		var rendererOptions = {
			antialias: true,
			preserveDrawingBuffer: true
		};

		if(isWebGlEnabled()) {
			this.renderer = new Three.WebGLRenderer(rendererOptions);
		} else {
			this.renderer = new Three.CanvasRenderer(rendererOptions);
		}
		
		this.renderer.setClearColorHex(0x333333, 1);
	    this.renderer.setSize(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);

	    Dom.setCanvas(this.renderer.domElement);

	    if(Settings.DEBUG_MODE){
	    	Dom.createDebugCanvas();
	    }

	    this.scene = new Three.Scene();
	 	this.scene.add(this.cameraController.getCamera());


	 	var ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
 
        var directionalLight = new Three.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0, 10).normalize();
        this.scene.add(directionalLight);


        this.createMesh(100, 100, 100, 100, 'static/img/100.png', function(mesh){
        	self.mesh = mesh;
        	self.scene.add(mesh);
        });
/*
 		this.createMesh(50, 50, 200, 100, 'static/img/100.png', function(mesh){
        	self.scene.add(mesh);
        });
*/

        //this.animate(this);
	}

	ViewController.prototype.update = function() {

		if(this.mesh) {
			this.mesh.rotation.z += .01;
	        this.mesh.position.z += 1;
	        this.mesh.position.x += .4;
	        this.mesh.position.y += .4;
        }

		this.render();
	}

	ViewController.prototype.render = function() {

		this.renderer.render(this.scene, this.cameraController.getCamera());
	}

	ViewController.prototype.createMesh = function(width, height, x, y, imgPath, callback) {
		var textureImg = new Image();
        textureImg.onload = function(){
	        var material = new Three.MeshLambertMaterial({
	            map: Three.ImageUtils.loadTexture(imgPath)
	        });

	        var mesh = new Three.Mesh(new Three.PlaneGeometry(width, height), material);
	        mesh.overdraw = true;/*
	        mesh.position.z = 0;
	        mesh.position.x = x;
	        mesh.position.y = y;
	        */
	        callback(mesh);
        };
        textureImg.src = imgPath;
	}

	return ViewController;
});