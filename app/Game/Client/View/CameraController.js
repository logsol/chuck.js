define(['Lib/Vendor/Three', 'Game/Config/Settings'], function (Three, Settings) {

    function CameraController () {
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

        this.setPosition(Settings.STAGE_WIDTH / 2, -Settings.STAGE_HEIGHT / 2);

        this.initWheel();
    }

    CameraController.prototype.initWheel = function() {
        var callback = this.handleWheel.bind(this);
        if(window.addEventListener)
            window.addEventListener("DOMMouseScroll", callback, false);
        else
            window.onmousewheel = document.onmousewheel = callback;
    };

    CameraController.prototype.handleWheel = function(event) {
        var delta = 0;
        if(!event) event = window.event; // IE
        if(event.wheelDelta) delta = event.wheelDelta/120;
        else if(event.detail) delta = -event.detail/3;
        if(delta) {
            this.setZoom(this.zoom + (delta / 30));
        }
        if(event.preventDefault) event.preventDefault();
        event.returnValue = false;
    };

    CameraController.prototype.getCamera = function () {
        return this.camera;
    }

    CameraController.prototype.setPosition = function (x, y) {
        this.camera.position.x = x;
        this.camera.position.y = y;
    }


    CameraController.prototype.setZoom = function (z) {
        this.zoom = z;
        z *= 2;
        console.log(this.zoom)
        this.camera.left   = - Settings.STAGE_WIDTH / z;
        this.camera.right  =   Settings.STAGE_WIDTH / z;
        this.camera.top    =   Settings.STAGE_HEIGHT / z;
        this.camera.bottom = - Settings.STAGE_HEIGHT / z;
        this.camera.updateProjectionMatrix();
    }

    return CameraController;
    
});