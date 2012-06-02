Game.Processor = function() {

    var self = this;
    this.count = 0;
    this._me;
    this._engine;
    this._camera;
    this._repository;
    this._inputControlUnit;
    this._keyboardInput;
}

Game.Processor.prototype.init = function() {
    this._engine = new Game.Physics.Engine();

    /*
    this._me         = new Player();

    this._camera     = Camera.getInstance()
    this._repository = Repository.getInstance();

    this._engine.setCollisionDetector();

    this._inputControlUnit = InputControlUnit.getInstance();
    this._keyboardInput    = KeyboardInput.getInstance();

    new Level();
    new Items();
    */
    //Out.put("Players spawn after 3 seconds.");
    //Out.put("Notice, that Player2 seems to be afk xD");



    window.setInterval(this._update, 1000/60, this);
    //View.getInstance().getSprite().addEventListener(Event.ENTER_FRAME, this._update)
}



Game.Processor.prototype.getMe = function() {
    return this._me;
}

Game.Processor.prototype.getEngine = function() {
    return this._engine;
}

Game.Processor.prototype._spawnPlayers = function(p1, p2) {
    p1.spawn(50, 250);
    this._camera.follow(p1);
}


Game.Processor.prototype._update  = function(self) {
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