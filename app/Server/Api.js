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

			var command,
					output = null;
					
			try {
				var message = JSON.parse(queryParameters);
				command = message.command;
			} catch(e) {
				this.isError = true;
				output = "JSON syntax error";
				console.error(e)
			}

			switch(command) {
				case "getChannels":
					output = this.coordinator.getChannels();
					break;
				case "createChannel":
					// FIXME: sanitize input
					output = this.createChannel(message.options);
					break;
				default:
					this.isError = true;
					output = "Command not found";
					break;
			}

			this.output = output;
		}

		Api.prototype.createChannel = function(options) {
			var result = this.coordinator.createChannel(options);
			if(result !== false) {
				return result;
			} else {
				this.isError = true;
				return "Could not create channel, name might already exist.";
			}
		};

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