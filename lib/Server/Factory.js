define(['Server/NotificationCenter'], function(NotificationCenter) {

	function Factory() {
		this.notificationCenter = new NotificationCenter();
	}

	Factory.prototype.new = function () {
		
		if (arguments.length < 1)
			throw 'Too fiew arguments';
		if (typeof arguments[0] != 'function')
			throw arguments[0] + ' is not a function';
		
		var type = arguments[0];
		var object = new (type.bind.apply(type,arguments))();
		object.notificationCenter = this.notificationCenter;
		object.factory = this;
		return object;
		
	}

	return Factory;
	
});