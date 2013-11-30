define(['Lib/Vendor/Three', 'Game/Config/Settings'], function (Three, Settings) {

    function CameraController (isOrthographic) {

        isOrthographic = typeof isOrthographic == 'undefined' 
            ? true 
            : isOrthographic;

        if(!isOrthographic) {
            
            this.camera = new Three.OrthographicCamera(
                -Settings.STAGE_WIDTH/2, 
                Settings.STAGE_WIDTH/2, 
                Settings.STAGE_HEIGHT/2, 
                -Settings.STAGE_HEIGHT/2, 
                -2000, 
                1000 
            );

        } else {

            this.camera = new Three.PerspectiveCamera(
                45, 
                Settings.STAGE_WIDTH / Settings.STAGE_HEIGHT, 
                1, 
                -500
            );
        }

        this.camera.position.z = 481;
        this.setPosition(Settings.STAGE_WIDTH / 2, -Settings.STAGE_HEIGHT / 2);
    }

    CameraController.prototype.getCamera = function () {
        return this.camera;
    }

    CameraController.prototype.setPosition = function (x, y) {
        this.camera.position.x = x;
        this.camera.position.y = y;
    }


    CameraController.prototype.setZoom = function (z) {
        this.camera.position.z = z;
    }

    return CameraController;
    
});