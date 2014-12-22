define([
	"Lib/Utilities/NotificationCenter",
	"Lib/Utilities/Protocol/Helper",
	"Lib/Utilities/Validate",
	"Lib/Utilities/Options",
	"Game/Config/Settings",
	"fs"
],
 
function (Nc, ProtocolHelper, validate, Options, Settings, FileSystem) {

	"use strict";

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
				this.output = "JSON syntax error";
				console.error(e);
				return;
			}

			switch(command) {
				case "getChannels":
					output = this.getChannels();
					break;
				case "createChannel":
					// FIXME: sanitize input
					output = this.createChannel(message.options);
					break;
				case "getMaps":
					output = this.getMaps();
					break;
				default:
					this.isError = true;
					output = "Command not found";
					break;
			}

			this.output = output;
		}

		Api.prototype.getChannels = function() {
			return this.coordinator.getChannels();
		};

		Api.prototype.createChannel = function(options) {

			var allowedOptionKeys = [
				"channelName",
				"maps",
				"maxUsers",
				"minUsers",
				"scoreLimit"
			];

			var newOptions = {};

			// Channelname
			if(validate(options.channelName, {type: 'string', minLength: 3, maxLength: 30})) {
				newOptions.channelName = options.channelName;
			} else {
				this.isError = true;
				return "Could not create channel, invalid channel name.";
			}

			// Maps / levelUids
			if( ! validate(options.levelUids, {type: 'array', minLength: 1, maxLength: 999})) {
				this.isError = true;
				return "Could not create channel, invalid maps.";
			} 

			for(var i = 0; i < options.levelUids.length; i++) {
				if(!validate(options.levelUids[i], {type: 'string', in: this.getMaps()})) {
					this.isError = true;
					return "Could not create channel, invalid map (" + options.levelUids[i] + ").";
				}
			}

			newOptions.levelUids = options.levelUids;

			// Users
			if(validate(options.maxUsers, {optional: true, type: 'number', min: 1, max: Settings.CHANNEL_MAX_USERS})) {
				newOptions.maxUsers = options.maxUsers;
			} else {
				this.isError = true;
				return "Could not create channel, Max users invalid. (Limited to " + Settings.CHANNEL_MAX_USERS + " users)";
			}

			if(validate(options.minUsers, {optional: true, type: 'number', min: 0, max: Settings.CHANNEL_MAX_USERS})) {
				newOptions.minUsers = options.minUsers;
			} else {
				this.isError = true;
				return "Could not create channel, Max users too high. Limited to: " + Settings.CHANNEL_MAX_USERS;
			}

			// Limits
			if(validate(options.scoreLimit, {type: 'number', min: 1, max: 999})) {
				newOptions.scoreLimit = options.scoreLimit;
			} else {
				this.isError = true;
				return "Could not create channel, score limit (" + options.scoreLimit + ").";
			}

			var defaultOptions = {
				maxUsers: Settings.CHANNEL_DEFAULT_MAX_USERS,
				minUsers: 0,
				scoreLimit: Settings.CHANNEL_DEFAULT_SCORE_LIMIT
			};

			options = Options.merge(options, defaultOptions);

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

			if(this.isError) {
				console.warn("API Error: " + this.output);
			}

			return JSON.stringify(output);
		};

		Api.prototype.getContentType = function() {
			return "application/json";
		};

		Api.prototype.getMaps = function(callback) {

			var list = FileSystem.readdirSync(Settings.MAPS_PATH);
			var maps = [];
			for (var i = 0; i < list.length; i++) {
				var fileinfo = list[i].split(".");
				if(fileinfo[1] == "json") {
					maps.push(fileinfo[0]);
				}
			};
			return maps.sort();
		};
 
		return Api;
 
});