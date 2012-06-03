Chuck.Processor = function() {

    var self = this;
    this.count = 0;
    this._me;
    this._engine;
    this._camera;
    this._repository;
    this._inputControlUnit;
    this._keyboardInput;
}

Chuck.Processor.prototype.init = function() {
    this._engine = new Chuck.Physics.Engine();

    this._me         = new Chuck.Player(this._engine, this._repository);

    //this._camera     = Camera.getInstance()
    //this._repository = Repository.getInstance();

    //this._engine.setCollisionDetector();

    //this._inputControlUnit = InputControlUnit.getInstance();
    //this._keyboardInput    = KeyboardInput.getInstance();

    
    new Chuck.Loader.Level(this._engine);
    //new Items();

    this._me.spawn(100, 0);
    //this._camera.follow(this._me);

    window.setInterval(this._update, 1000/60, this);
    //View.getInstance().getSprite().addEventListener(Event.ENTER_FRAME, this._update)
}



Chuck.Processor.prototype.getMe = function() {
    return this._me;
}

Chuck.Processor.prototype.getEngine = function() {
    return this._engine;
}


Chuck.Processor.prototype._update  = function(self) {
    self.count++;
    
    self._engine.update();
    // Order is important
    /*
    self._repository.update();
    self._keyboardInput.update();
    self._me.update();
    self._camera.update();
    */
}