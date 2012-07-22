define([
],

function() {

	function CoordinatorLink(process) {
		this.process = process;
	}

	CoordinatorLink.prototype.send = function(message) {
		this.process.send(message);
	};

	CoordinatorLink.prototype.receive = function(message) {
		throw 'This method is abstract and must be overwritten by Channel';
	};

	return CoordinatorLink;

});