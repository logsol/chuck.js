define([
	"Game/Core/Loader/Level",
	"Game/Config/Settings",
	"fs"
],

function (Parent, Settings, FileSystem) {

	"use strict";

    function Level (uid, engine, gameObjects) {
        Parent.call(this, uid, engine, gameObjects);
    }

    Level.prototype = Object.create(Parent.prototype);

    Level.prototype.loadLevelDataFromPath = function (path, callback) {
    	// overwriting parent

    	FileSystem.readFile(path, "utf8", function (err, data) {
		  if (err) throw err;
		  callback(JSON.parse(data));
		});
    }

    return Level;
});