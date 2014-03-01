define([
	"Game/Core/Loader/Level",
	"Game/Config/Settings",
	"fs"
],

function (Parent, Settings, fs) {

    function Level (uid, engine, gameObjects) {
        Parent.call(this, uid, engine, gameObjects);
    }

    Level.prototype = Object.create(Parent.prototype);

    Level.prototype.loadLevelDataFromPath = function (path, callback) {
    	// overwriting parent

    	fs.readFile(path, "utf8", function (err, data) {
		  if (err) throw err;
		  callback(JSON.parse(data));
		});
    }

    return Level;
});