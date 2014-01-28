define([
	"Game/Core/Loader/Level",
	"Game/Config/Settings"
	"fs"
],

function (Parent, Fs) {

    function Level () {
        Parent.call(this);
    }

    Level.prototype = Object.create(Parent.prototype);

    Level.prototype.loadLevelObjectFromPath = function (path, callback) {
    	// overwriting parent

    	fs.readFile( + path, function (err, data) {
		  if (err) throw err;
		  callback(data);
		});
    }

    return Level;
});