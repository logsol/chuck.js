define([
],
 
function () {
 
    function validate(object, description) {

    	if(description.optional && (object === null || object === "")) {
    		return true;
    	}

    	if(object === null) {
    		return false;
    	}

    	if(typeof object === 'undefined') {
    		return false;
    	}

    	if(typeof object === 'NaN') {
    		return false;
    	}

    	if(description.type == 'array' && !(object instanceof Array)) {
    		return false;
    	}

    	if(description.type != 'array' && typeof object != description.type) {
			return false;
    	}

    	if(description.max && object > description.max) {
    		return false;
    	}

    	if(description.min && object < description.min) {
    		return false;
    	}

    	if(description.maxLength && object.length > description.maxLength) {
    		return false;
    	}

    	if(description.minLength && object.length < description.minLength) {
    		return false;
    	}

    	if(description.in && description.in.indexOf(object) === -1) {
    		return false;
    	}

    	if(description.regex && !description.regex.test(object)) {
    		return false;
    	}

    	return true;
    }
 
    return validate;
 
});