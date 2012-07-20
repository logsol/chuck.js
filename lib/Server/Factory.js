define(['Server/NotificationCenter'], function(NotificationCenter) {

	function Factory() {
	    this.notificationCenter = new NotificationCenter();
	}

	Factory.prototype.new = function (constructor /*, arg1, arg2, ... */) {
	    
	    if (arguments.length < 1)
	        throw 'Too fiew arguments';
	    if (typeof arguments[0] != 'function')
	        throw arguments[0] + ' is not a function';
	    
	    var instance = Object.create(constructor.prototype, {
	        notificationCenter: {
	             value: this.notificationCenter
	        },
	        factory: {
	            value: this
	        }
	    });
	    
	    constructor.apply(instance, Array.prototype.slice.call(arguments, 1));
	    return instance; 
	}

	return Factory;
	
});