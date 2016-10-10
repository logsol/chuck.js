define([
	"Game/Config/Settings",
	"Lib/Utilities/ColorConverter",
	"Lib/Utilities/Exception",
	"Game/Client/PointerLockManager",
	"Lib/Utilities/QuerySelector"
],
 
function (Settings, ColorConverter, Exception, pointerLockManager, qs) {

	"use strict";

	var instance = null
	var quickstartChannelName = "Quickstart";
 
    function Menu() {

    }

    Menu.prototype.init = function() {
    	instance = this; // Dum und Dümmer

    	if(localStorage["player"]) {
			var player = JSON.parse(localStorage["player"]);
			if(player.nickname) {
				qs.$("#nick").value = player.nickname;
			}
		}

		if(localStorage["customname"]) {
			qs.$("#customname").value = localStorage["customname"];
		}
		qs.$("#scoreLimit").value = Settings.CHANNEL_DEFAULT_SCORE_LIMIT;
		qs.$("#userLimit").value = Settings.CHANNEL_DEFAULT_MAX_USERS;


		qs.$("#refresh").onclick = refresh;
		refresh();
		populateMaps();
		this.channelDestructionTimeout = null;
		this.refreshInterval = setInterval(refresh, 5000);

		qs.$("#createbutton").onclick = function() {
			show('#createform');
			return false;
		};
		qs.$("#quickstartbutton").onclick = quickstart;

		var cancelButtons = qs.$$(".cancel");
		for (var i = 0; i < cancelButtons.length; i++) {
			cancelButtons[i].onclick = function() {
				show('#listform');
				return false;
			};
		};

		this.colorConverter = new ColorConverter();
		var c = qs.$("#nick");
		c.onchange = c.onkeyup = c.onblur = c.onclick = this.updatePrimaryColor.bind(this);
		this.updatePrimaryColor({target:c});
    };

    Menu.prototype.updatePrimaryColor = function(e) {
    	qs.$("#primarycolor").style.backgroundColor = "#" + this.colorConverter.getColorByName(e.target.value).toString(16);
    };

	Menu.prototype.onRun = function(channelName, nickname) {
		throw new Exception("Menu onRun has to be overwritten");
	}

	window.onhashchange = function() {
		if(window.location.hash) {
			if(qs.$("#game").style.display == "block") {
				window.location.reload();
			}
			refresh(function(list) {
				var channelName = unescape(window.location.hash.substr(1));

				if (channelName == quickstartChannelName) {
					quickstart();
					return;
				}

				if(channelExists(list, channelName)) {
					showCustomJoinForm()
				} else {
					alert("Channel \"" + channelName + "\" does not exist (anymore).")
					window.location.href = "/";
				}
			});
		}
	}

	window.onload = window.onhashchange;

	var lastRefreshResponse;
	function refresh(callback) {

		ajax("getChannels", {}, function(response) {
			if(response != lastRefreshResponse) {
				lastRefreshResponse = response;
				populate(JSON.parse(response).success);
			}
			document.body.className = "";	

			if(typeof callback == 'function') {
				callback(JSON.parse(response).success)
			}

		}, function(status, responseText) {
			console.error("getChannels error: ", responseText)
		});

	    return false;
	}

	function ajax(command, options, callback, errorCallback) {
		try {
			var xhr = new XMLHttpRequest();
		    xhr.onreadystatechange = function() {
		        if(xhr.readyState == 4) {
		            if(xhr.status == 200) {
		            	if(typeof callback == 'function') {
		            		callback(xhr.responseText)
		            	} 
		            } else {
		                if(typeof errorCallback == 'function' && xhr.status == "400") {
							errorCallback(xhr.status, xhr.responseText);
		                } else {
							console.error("Ajax error: " + xhr.status + " " + xhr.responseText)
							qs.$("#list").innerHTML = "";
							document.body.className = "offline";				
						}
		            }
		        }
		    }
		    xhr.open("POST", "/api", true);
		    xhr.send(JSON.stringify({command:command, options:options}));
	    } catch(e) {
			console.error(e)
		}
	}

	function populate(list) {


		var html = "";
		if(list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				
				var channel = list[i];
				var fullState = channel.playerCount >= channel.maxUsers;
				var fullString = fullState ? "&nbsp;Full" : "";
				var fullStyle = fullState ? 'class="full"' : "";
				var players = channel.playerCount 
					? "<span id='players'>Player:<br>- " + channel.players.join("<br>- ") + "</span>"
					: "";
				
				html += "<tr "+fullStyle+">";
				html += "<td><a href='#" + channel.channelName + "'>" + channel.channelName + "</a></td>";
				html += "<td>death match</td>";
				html += "<td class='playersCell'>" + channel.playerCount + fullString + players + "</td>";
				html += "</tr>";
			};
		} else {
			html += "<tr><td colspan='3'>No channels found.</td></tr>";
		}

		qs.$("#list").innerHTML = html;
	}

	function populateMaps() {
		ajax("getMaps", {}, function(responseText) {
			var maps = JSON.parse(responseText).success;
			var html = "";
			for (var i = 0; i < maps.length; i++) {
				var map = maps[i];
				html += "<li><label>";
				html += '<input name="maps" value="' + map + '" type="checkbox" checked> ';
				html += map;
				html += "</label></li>";
			};

			qs.$("#maps").innerHTML = html;
		}, function(status, responseText) {
			console.error("getMaps error:", status, responseText);
		});
	}

	qs.$("form#listform").onsubmit = function(e) {
		try {
			var nickname = qs.$("#nick").value;
			var channelName = getSelectedChannel();
			join(nickname, channelName);
		} catch(e) {
			console.error(e)
		}

		return false;
	}

	qs.$("form#createform").onsubmit = function(e) {
		try {

			var options = {
				channelName: qs.$("#customname").value,
				levelUids: getSelectedMaps(),
				maxUsers: parseInt(qs.$("#userLimit").value, 10),
				scoreLimit: parseInt(qs.$("#scoreLimit").value, 10)
			};

			create(options, onCreateSuccess);
		} catch(e) {
			console.error(e)
		}

		return false;
	}

	qs.$("form#customjoinform").onsubmit = function(e) {
		try {
			var nickname = qs.$("#nick").value;
			var channelName = qs.$("#customname").value;
			join(nickname, channelName);
		} catch(e) {
			console.error(e);
		}

		return false;
	}

	function onCreateSuccess(options) {
		window.location.hash = options.channelName;
		startTimer(options.timeout);
	}

	function showCustomJoinForm() {
		qs.$("#customname").value = unescape(window.location.hash.substr(1));
		qs.$("#link").value = window.location.href;
		show("#customjoinform");
	}

	function show(id) {
		qs.$("#createform").style.display = "none";
		qs.$("#listform").style.display = "none";
		qs.$("#customjoinform").style.display = "none";
		qs.$("#game").style.display = "none";

		if(id != "#customjoinform") {
			history.pushState("", document.title, window.location.pathname);
		}

		qs.$(id).style.display = "block";
	}

	function quickstart() {
		refresh(function(list){
			var defaultChannelName = quickstartChannelName;
			history.pushState("", document.title, window.location.pathname + "#" + defaultChannelName);
			var nickname = qs.$("#nick").value;

			if(!nickname) {
				nickname = "Guest" + (Math.floor(Math.random() * 899) + 100)
			}

			if(!channelExists(list, defaultChannelName)) {

				var options = {
					channelName: defaultChannelName,
					levelUids: getSelectedMaps(),
					maxUsers: parseInt(qs.$("#userLimit").value, 10),
					scoreLimit: parseInt(qs.$("#scoreLimit").value, 10)
				};

				create(options, function() {
					join(nickname, defaultChannelName); // only called on success
				});
			} else {
				join(nickname, defaultChannelName);
			}
		});
		return false;
	}

	function startTimer(seconds) {
		var now = new Date();
		var end = new Date(now.getTime() + seconds * 1000);
		instance.channelDestructionTimeout = setInterval(function() {
			now = new Date();
			var diff = new Date(end.getTime() - now.getTime());
			if(diff.getTime() < 0) {
				alert("Your channel has timed out.");
				window.location.href = "/";
			} else {
				qs.$("#timeout").innerHTML = " within " + formatDate(diff) + " minutes";
			}
		}, 1000);
	}

	function formatDate(date) {
	    var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		if(minutes < 10) minutes = "0" + minutes;
		if(seconds < 10) seconds = "0" + seconds;

		return minutes + ":" + seconds;
	}

	function channelExists(list, channelName) {
		for (var i = 0; i < list.length; i++) {
			var channel = list[i];
			if(channel.channelName == channelName) {
				return true;
			}
		}
		return false;
	}

	function validateForJoin(nickname, channelName) {
		if(!nickname || nickname.length < 3) {
			alert("Nickname too short")
			return false;
		}
		if(!channelName) {
			alert('No channel name provided');
			return false;
		}
		return true;
	}

	function validateForCreate(options) {

		return true;
		// great validation on server side does it all.

		/*
		if(options.levelUids.length < 1) {
			alert("Please choose at least one map.")
			return false;
		}
		
		if(!options.channelName || options.channelName.length < 3) {
			alert("Please provide a channel name of at least 3 characters.")
			return false;
		}

		if(!parseInt(options.maxUsers) > 1 || !parseInt(options.maxUsers) < 20) {
			alert("Number of users must be larger than 1 and smaller than 20.");
			return false;
		}

		if(!parseInt(options.scoreLimit) > 1 || !parseInt(options.scoreLimit) < 99) {
			alert("Score limit must be larger than 1 and smaller than 99.");
			return false;
		}
		return true;
		*/
	}

	function getSelectedMaps() {
		var maps = [];
		var checkboxes = document.querySelectorAll("form#createform input[name=maps]");
		for (var i = 0; i < checkboxes.length; i++) {
			var checkbox = checkboxes[i];
			if(checkbox.checked) {
				maps.push(checkbox.value);
			}
		};
		return maps;
	}

	function getSelectedChannel() {
		var name = null;
		var radios = document.querySelectorAll("form#listform input[name=channel]");
		for (var i = 0; i < radios.length; i++) {
			var radio = radios[i];
			if(radio.checked) {
				name = radio.value;
				break;
			}
		};
		return name
	}

	function join(nickname, channelName) {
		if(validateForJoin(nickname, channelName)) {
			localStorage["player"] = JSON.stringify({
				nickname: nickname
			});
			localStorage["channel"] = JSON.stringify({
				name: channelName
			});

			//window.location.href = "/game.html";
			qs.$("#menu").style.display = "none";
			qs.$("#game").style.display = "block";
			instance.onRun(channelName, nickname); // Dumm und dümmer
			
			if(instance.refreshInterval) {
				clearInterval(instance.refreshInterval);
			}

			if(instance.channelDestructionTimeout) {
				clearInterval(instance.channelDestructionTimeout);
			}

			pointerLockManager.request();
		}
	}

	function create(options, callback) {
			
		if(validateForCreate(options)) {

			options["minUsers"] = 1;
			localStorage["customname"] = options.channelName;

			ajax("createChannel", options, function(responseText) {
				if(typeof callback == 'function') {
					callback(JSON.parse(responseText).success);
	            }
			}, function(status, responseText) {
				console.log(responseText)
	            alert(JSON.parse(responseText).error)
			});
		}
	}

	qs.$("#canvas").onclick = function(){
		pointerLockManager.request();
	};
 
    return Menu;
 
});