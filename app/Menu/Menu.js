define([
	"Lib/Utilities/ColorConverter"
],
 
function (ColorConverter) {

	var instance = null
 
    function Menu() {

    }

    Menu.prototype.init = function() {
    	instance = this; // Dum und Dümmer

    	if(localStorage["player"]) {
			var player = JSON.parse(localStorage["player"]);
			if(player.nickname) {
				$("#nick").value = player.nickname;
			}
		}

		if(localStorage["customname"]) {
			$("#customname").value = localStorage["customname"];
		}


		$("#refresh").onclick = refresh;
		refresh();
		populateMaps();
		var channelDestructionTimeout = null;
		var refreshInterval = setInterval(refresh, 5000);

		$("#createbutton").onclick = function() {
			show('#createform');
			return false;
		};
		$("#quickstartbutton").onclick = quickstart;

		var cancelButtons = $$(".cancel");
		for (var i = 0; i < cancelButtons.length; i++) {
			cancelButtons[i].onclick = function() {
				show('#listform');
				return false;
			};
		};

		this.colorConverter = new ColorConverter();
		var c = $("#nick");
		c.onchange = c.onkeyup = c.onblur = c.onclick = this.updatePrimaryColor.bind(this);
		this.updatePrimaryColor({target:c});
    };

    Menu.prototype.updatePrimaryColor = function(e) {
    	$("#primarycolor").style.backgroundColor = "#" + this.colorConverter.getColorByName(e.target.value).toString(16);
    };

	Menu.prototype.onRun = function(channelName, nickname) {}

	window.onhashchange = function() {
		if(window.location.hash) {
			if($("#game").style.display == "block") {
				window.location.reload();
			}
			refresh(function(list) {
				var channelName = unescape(window.location.hash.substr(1));
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

	function $(selector) {
		return document.querySelector(selector);
	}

	function $$(selector) {
		return document.querySelectorAll(selector);
	}

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
							$("#list").innerHTML = "";
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
				html += "<tr><td>";
					html += "<a href='#" + channel.name + "'>";
				html += channel.name
				html += "</a></td><td>death match</td></tr>";
			};
		} else {
			html += "<tr><td colspan='2'>No channels found.</td></tr>";
		}

		$("#list").innerHTML = html;
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

			$("#maps").innerHTML = html;
		}, function(status, responseText) {
			console.error("getMaps error:", status, responseText);
		});
	}

	$("form#listform").onsubmit = function(e) {
		try {
			var nickname = $("#nick").value;
			var channelName = getSelectedChannel();
			join(nickname, channelName);
		} catch(e) {
			console.error(e)
		}

		return false;
	}

	$("form#createform").onsubmit = function(e) {
		try {
			var channelName = $("#customname").value;
			create(channelName, onCreateSuccess);
		} catch(e) {
			console.error(e)
		}

		return false;
	}

	$("form#customjoinform").onsubmit = function(e) {
		try {
			var nickname = $("#nick").value;
			var channelName = $("#customname").value;
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
		$("#customname").value = unescape(window.location.hash.substr(1));
		$("#link").value = window.location.href;
		show("#customjoinform");
	}

	function show(id) {
		$("#createform").style.display = "none";
		$("#listform").style.display = "none";
		$("#customjoinform").style.display = "none";
		$("#game").style.display = "none";

		if(id != "#customjoinform") {
			history.pushState("", document.title, window.location.pathname);
		}

		$(id).style.display = "block";
	}

	function quickstart() {
		refresh(function(list){
			var defaultChannelName = "Dungeon";
			history.pushState("", document.title, window.location.pathname + "#" + defaultChannelName);
			var nickname = $("#nick").value;

			if(!nickname) {
				nickname = "Guest" + (Math.floor(Math.random() * 899) + 100)
			}

			if(!channelExists(list, defaultChannelName)) {
				create(defaultChannelName, function() {
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
		channelDestructionTimeout = setInterval(function() {
			now = new Date();
			var diff = new Date(end.getTime() - now.getTime());
			if(diff.getTime() < 0) {
				alert("Your channel has timed out.");
				window.location.href = "/";
			} else {
				$("#timeout").innerHTML = " within " + formatDate(diff) + " minutes";
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
			if(channel.name == channelName) {
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

	function validateForCreate(channelName, maps) {
		return true;
		if(maps.length < 1) {
			alert("Please choose at least one map.")
			return false;
		}
		
		if(!channelName) {
			alert("Please provide a channel name.")
			return false;
		}
		return true;
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
			$("#menu").style.display = "none";
			$("#game").style.display = "block";
			instance.onRun(channelName, nickname); // Dumm und dümmer
			
			if(refreshInterval) {
				clearInterval(refreshInterval);
			}

			if(channelDestructionTimeout) {
				clearInterval(channelDestructionTimeout);
			}

		}
	}

	function create(channelName, callback) {
		var maps = getSelectedMaps();
			
		if(validateForCreate(channelName, maps)) {

			var options = {
				channelName: channelName,
				levelUids: maps,
				maxUsers: 10,
				minUsers: 2,
				scoreLimit: parseInt($("#scoreLimit").value, 10)
			}

			localStorage["customname"] = channelName;

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
 
    return Menu;
 
});