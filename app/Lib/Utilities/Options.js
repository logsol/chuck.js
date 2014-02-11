define([
	"Lib/Utilities/Exception"
],
 
function (Exception) {
 
    function Options() {

    }
 
    Options.prototype.merge = function(options, preset) {

    	if(!preset && !options) {
    		throw new Exception("Options requires objects");
    	}

    	if(preset.constructor !== Object && options.constructor !== Object) {
    		throw new Exception("Options requires objects");
    	}

		if(!preset || preset.constructor !== Object) {
			return options;
		}
		
		if(!options || options.constructor !== Object) {
			return preset;
		}

		for (var key in options) {
			if(!preset.hasOwnProperty(key)) {
				preset[key] = options[key];
			} else {
				if(options[key].constructor !== Object) {
					preset[key] = options[key];
				} else {
					preset[key] = Options.prototype.merge.call(this, options[key], preset[key]);
				}
			}
		}

		return preset;
	}
 
    return new Options();
 
});