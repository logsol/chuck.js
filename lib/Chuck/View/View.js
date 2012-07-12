define(["Vendor/Three", "Chuck/Settings", "Chuck/View/CameraController"], function(Three, Settings, CameraController){
	
	function View(){

		this.scene = null;
		this.renderer = null;
		this.cameraController = new CameraController();

		this.init();
	}

	View.prototype.init = function(){

		var self = this;

		this.renderer = new Three.WebGLRenderer({
			//antialias: true,
			preserveDrawingBuffer: true
		});
		this.renderer.setClearColorHex(0x333333, 1);
	    this.renderer.setSize(Settings.STAGE_WIDTH, Settings.STAGE_HEIGHT);

	    document.body.appendChild(this.renderer.domElement);

	    this.scene = new Three.Scene();
	 	this.scene.add(this.cameraController.getCamera());


	 	var ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
 
        var directionalLight = new Three.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0, 10).normalize();
        this.scene.add(directionalLight);


        this.createMesh(100, 100, 100, 100, 'static/img/100.png', function(mesh){
        	self.scene.add(mesh);
        	self.animate(self);
        });

        //this.animate(this);
	}

	View.prototype.animate = function(scope) {
		requestAnimationFrame(function(){
			scope.animate(scope);
		});
		//plane.rotation.z += .01;
        //plane.position.z += 1;
        //plane.position.x += .4;
        //plane.position.y += .4;

		scope.render();
		//stats.update();
	}

	View.prototype.render = function() {

		this.renderer.render(this.scene, this.cameraController.getCamera());
	}

	View.prototype.createMesh = function(width, height, x, y, imgPath, callback) {
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

	return View;
});