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

        this.camera.position.z = 481; // 481 
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
        if(delta) this.camera.position.z += delta * 10;
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
        this.camera.position.z = z;
    }

    return CameraController;
    
});