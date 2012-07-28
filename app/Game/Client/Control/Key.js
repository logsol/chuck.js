define(function () {

    function Key () {
        this._active = false;
        this._activityUpdateStatus = false;
        this._activityUpdateNeeded = false;
        this._keyDownFunction = null;
        this._keyUpFunction = null;
        this._keyFrameFunction = null;
    }
    
    Key.prototype.setActivityUpdateStatus = function (active)  {
        this._activityUpdateStatus = active;
    }

    Key.prototype.getActivityUpdateStatus = function ()  {
        return this._activityUpdateStatus;
    }

    Key.prototype.setActivityUpdateNeeded = function (need)  {
        this._activityUpdateNeeded = need;
    }

    Key.prototype.getActivityUpdateNeeded = function ()  {
        return this._activityUpdateNeeded;
    }

    Key.prototype.setActive = function (active)  {
        this._active = active;
    }

    Key.prototype.getActive = function ()  {
        return this._active;
    }

    Key.prototype.setKeyDownFunction = function (f)  {
        this._keyDownFunction = f;
    }

    Key.prototype.getKeyDownFunction = function ()  {
        return this._keyDownFunction;
    }

    Key.prototype.setKeyUpFunction = function (f)  {
        this._keyUpFunction = f;
    }

    Key.prototype.getKeyUpFunction = function ()  {
        return this._keyUpFunction;
    }

    Key.prototype.setKeyFrameFunction = function (f)  {
        this._keyFrameFunction = f;
    }

    Key.prototype.getKeyFrameFunction = function ()  {
        return this._keyFrameFunction;
    }

    return Key;
});