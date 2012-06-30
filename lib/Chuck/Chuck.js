define(["Chuck/Processor"], function(Processor){
	var Chuck = {};

	Chuck.init = function(){
		var processor = new Processor();
	}

	Chuck.processRequest = function(package){
		console.log(package);
	}

	return Chuck;
});