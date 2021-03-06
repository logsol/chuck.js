define([
	"Lib/Utilities/Exception"
],
 
function (Exception) {

	"use strict";
 
    function OptionsHelper() {

    }
 
    // FIXME we could actually use Object.assign() for merging here
    OptionsHelper.prototype.merge = function(options, preset) {

    	if(!preset && !options) {
    		throw new Exception("OptionsHelper requires objects");
    	}

    	if(preset.constructor !== Object && options.constructor !== Object) {
    		throw new Exception("OptionsHelper requires objects");
    	}

		if(!preset || preset.constructor !== Object) {
			return options;
		}
		
		if(!options || options.constructor !== Object) {
			return preset;
		}

		// FIXME there is a bad bug here, the preset is being manipulated by reference, so no config can be used!
		
		// hotfix for the bug
		preset = JSON.parse(JSON.stringify(preset));

		for (var key in options) {
			if(!preset.hasOwnProperty(key)) {
				preset[key] = options[key];
			} else {
				if(options[key] === undefined) {
					continue;
				}
				if(options[key].constructor !== Object) {
					preset[key] = options[key];
				} else {
					preset[key] = OptionsHelper.prototype.merge.call(this, options[key], preset[key]);
				}
			}
		}

		return preset;
	}
 
    return new OptionsHelper();

});
