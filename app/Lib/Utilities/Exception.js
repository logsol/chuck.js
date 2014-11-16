define([
],
 
function() {
 
    function Exception(/* arguments */) {
    	var message = [];
    	for (var i = 0; i < arguments.length; i++) {
    		var arg = arguments[i];
    		if (typeof arg == "object") {
    			var name = this.getTypeOfObject(arg);
    			message.push(name); 
    		} else {
    			message.push(arg);
    		}
    	};

        this.message = message.join(" ");

    	var e = Error.call(this, this.message);
        console.log(e.stack)
    }

    Exception.prototype = Object.create(Error.prototype);

    Exception.prototype.toString = function() {
		return this.message;
    };

    Exception.prototype.getTypeOfObject = function (obj) {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }
  
    return Exception;
 
});