Chuck.Control.Key = function() {
    this._active = false;
    this._activityUpdateStatus = false;
    this._activityUpdateNeeded = false;
    this._keyDown = null;
    this._keyUp = null;
    this._keyFrame = null;

}
Chuck.Control.Key.prototype.setActivityUpdateStatus = function(active)  {
    this._activityUpdateStatus = active;
}

Chuck.Control.Key.prototype.getActivityUpdateStatus = function()  {
    return this._activityUpdateStatus;
}

Chuck.Control.Key.prototype.setActivityUpdateNeeded = function(need)  {
    this._activityUpdateNeeded = need;
}

Chuck.Control.Key.prototype.getActivityUpdateNeeded = function()  {
    return this._activityUpdateNeeded;
}

Chuck.Control.Key.prototype.setActive = function(active)  {
    this._active = active;
}

Chuck.Control.Key.prototype.getActive = function()  {
    return this._active;
}

Chuck.Control.Key.prototype.setKeyDownFunction = function(f)  {
    this._keyDown = f;
}

Chuck.Control.Key.prototype.getKeyDownFunction = function()  {
    return this._keyDown;
}

Chuck.Control.Key.prototype.setKeyUpFunction = function(f)  {
    this._keyUp = f;
}

Chuck.Control.Key.prototype.getKeyUpFunction = function()  {
    return this._keyUp;
}

Chuck.Control.Key.prototype.setKeyFrameFunction = function(f)  {
    this._keyFrame = f;
}

Chuck.Control.Key.prototype.getKeyFrameFunction = function()  {
    return this._keyFrame;
}
