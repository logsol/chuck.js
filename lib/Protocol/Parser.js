define(function() {

	function Parser() {
	}

	Parser.prototype.encode = function(message){
		return JSON.stringify(message);
	}

	Parser.prototype.decode = function(message){
		return JSON.parse(message);
	}

	return Parser;
});