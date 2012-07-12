define(['Vendor/Wrapper/Three', 'Chuck/Settings'], function(Three, Settings) {

	function CameraController() {
		this.camera = new Three.OrthographicCamera(
			-Settings.STAGE_WIDTH/2, 
			Settings.STAGE_WIDTH/2, 
			Settings.STAGE_HEIGHT/2, 
			-Settings.STAGE_HEIGHT/2, 
			-2000, 
			1000 
		);

		//this.camera = new Three.PerspectiveCamera(45, 600 / 400, 1, 1000);

		this.camera.position.z = 481;
	}

	CameraController.prototype.getCamera = function(){
	    return this.camera;
	}

	CameraController.prototype.setPosition = function(x, y, z){
		this.camera.position.x = x;
		this.camera.position.y = y;
		this.camera.position.z = z;
	}

	return CameraController;
	
});