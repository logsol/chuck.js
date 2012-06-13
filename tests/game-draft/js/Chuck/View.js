Chuck.View = function(processor){
    var self = this;
    
    this._processor = processor;
    this._renderer = null;
    this._camera;
    this._scene;
    
    this.init();
}

Chuck.View.prototype.init = function(){
    if(!Chuck.Settings.DEBUG_DRAW) {
        $('#container').removeChild($('#container canvas'));
        return;
        self._renderer = new THREE.WebGLRenderer();
        self._renderer.setSize(Chuck.Settings.STAGE_WIDTH, Chuck.Settings.STAGE_HEIGHT);
        $('#container').append(self._renderer.domElement);
    }

    self._scene = new THREE.Scene();
    self._camera = new THREE.PerspectiveCamera(45, Chuck.Settings.STAGE_WIDTH / Chuck.Settings.STAGE_HEIGHT, 1, 1000);
    self._camera.position.z = 700;
    self._scene.add(self._camera);
}

Chuck.View.prototype.enterFrame = function(){
    
}

Chuck.View.prototype.animate = function() {
    if(this._renderer){ // if not debug_draw
        this._renderer.render(this._scene, this._camera);
    }
    this._processor.update();
    enterFrame.call(this, this.animate);
}

Chuck.View.prototype.getScene = function(){
    return this._scene;
}

Chuck.View.prototype.getCamera = function(){
    return this._camera;
}

Chuck.View.prototype.getRenderer = function(){
    return this._renderer;
}

Chuck.View.prototype.createPlane = function(x, y, width, height){
    
    var material = new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture("img/green.png")
    });
        
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    plane.overdraw = true;
    this._scene.add(plane);
    return plane;
}