define([
	"Game/Core/Loader/Level",
	"Game/Config/Settings"
],

function (Parent, Settings) {

    function Level (uid, engine, gameObjects) {
        Parent.call(this, uid, engine, gameObjects);
    }

    Level.prototype = Object.create(Parent.prototype);

    Level.prototype.loadLevelDataFromPath = function (path, callback) {
    	
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                        if(xhr.status == 200) {
                                callback(JSON.parse(xhr.responseText))
                        } else {
                                console.error("Ajax error: " + xhr.status + " " + xhr.statusText)
                        }
                }
        }
        xhr.open("GET", path, true);
        xhr.send(null);
    }

    return Level;
});