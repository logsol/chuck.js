define(["Vendor/Wrapper/Three", "Chuck/Settings", "Chuck/View/CameraController"], function(Three, Settings, CameraController){
	
	function View(){

		this.scene = null;
		this.renderer = null;
		this.cameraController = new CameraController();

		this.init();
	}

	View.prototype.init = function(){

		var self = this;

		this.renderer = new Three.WebGLRenderer();
	    this.renderer.setSize(600, 400);
	    document.body.appendChild(this.renderer.domElement);

	    this.scene = new Three.Scene();
	 	this.scene.add(this.cameraController.getCamera());

/*
	 	var ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
 
        var directionalLight = new Three.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0, 10).normalize();
        this.scene.add(directionalLight);


        this.createMesh(100, 100, 100, 100, 'static/img/100.png', function(mesh){
        	console.log(mesh);
        	self.scene.add(mesh);
        });

        this.createMesh(100, 100, 210, 100, 'static/img/100.png', function(mesh){
        	self.scene.add(mesh);
        });
*/
        this.animate(this);
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
		console.log('render', this);
		this.renderer.render(this.scene, this.cameraController.getCamera());
	}

	View.prototype.createMesh = function(width, height, x, y, img, callback) {
		var textureImg = new Image();
        textureImg.onload = function(){
	        var material = new Three.MeshLambertMaterial({
	            map: Three.ImageUtils.loadTexture(img)
	        });

	        var plane = new Three.Mesh(new Three.PlaneGeometry(width, height), material);
	        plane.overdraw = true;
	        plane.position.z = 0;
	        plane.position.x = x;
	        plane.position.y = y;
	        
	        callback(plane);
        };
        textureImg.src = img;
	}

	return View;
});