define([
	"Lib/Utilities/NotificationCenter",
	"Lib/Utilities/Protocol/Helper"
],
 
function (Nc, ProtocolHelper) {
 
    function Api(coordinator) {
    	this.coordinator = coordinator;
    	this.isError = false;
    	this.output = null;
    }
 
    Api.prototype.handleCall = function(queryParameters) {

    	var command;
    	try	{
	    	var message = JSON.parse(queryParameters);
	    	command = message.command;
    	} catch(e) {
    		console.error(e)
    	}

    	var output = null;
       	switch(command) {
       		case "getChannels":
       			output = this.coordinator.getChannels();
       			break;
       		default:
       			this.isError = true;
       			output = "Command not found";
       			break;
       	}

       	this.output = output;
    }

    Api.prototype.getOutput = function() {
    	var output = {};
    	var key = this.isError ? "error" : "success";
    	output[key] = this.output;
    	return JSON.stringify(output);
    	
    };

    Api.prototype.getContentType = function() {
    	return "application/json";
    };
 
    return Api;
 
});