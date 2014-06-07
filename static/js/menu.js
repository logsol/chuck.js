function $(selector) {
	return document.querySelector(selector);
}

function $$(selector) {
	return document.querySelectorAll(selector);
}

if(localStorage["player"]) {
	var player = JSON.parse(localStorage["player"]);
	if(player.nickname) {
		$("#nick").value = player.nickname;
	}
}

if(localStorage["customname"]) {
	$("#customname").value = localStorage["customname"];
}

var lastRefreshResponse;
function refresh(callback) {
		try {
		var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function() {
	        if(xhr.readyState == 4) {
	            if(xhr.status == 200) {

	            	var response = xhr.responseText;
	            	if(response != lastRefreshResponse) {
	            		lastRefreshResponse = response;
	            		populate(JSON.parse(response).success);
	            	}
	            	document.body.className = "";	

	            	if(typeof callback == 'function') {
	            		callback(JSON.parse(response).success)
	            	} 
	            } else {
	                console.error("Ajax error: " + xhr.status + " " + xhr.responseText)
	                $("#list").innerHTML = "";
	                document.body.className = "offline";
	            }
	        }
	    }
	    xhr.open("POST", "/api", true);
	    xhr.send(JSON.stringify({command:"getChannels"}));
    } catch(e) {
		console.error(e)
	}
    return false;
}

function populate(list) {
	var html = "";
	if(list.length > 0) {
		for (var i = 0; i < list.length; i++) {
			var channel = list[i];
			html += "<tr><td><label>";
			html += "<input name='channel' type='radio' value='" + channel.name + "'"
			if(i == 0) html += " checked"
				html += "> ";
			html += channel.name
			html += "</label></td><td></td></tr>";
		};			
	} else {
		html += "<tr><td colspan='2'>No channels found.</td></tr>";
	}

	$("#list").innerHTML = html;
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
	$("#customname").value = options.channelName;
	$("#link").value = window.location.href + options.link;
	show("#customjoinform");
	startTimer(options.timeout);
}

function show(id) {
	$("#createform").style.display = "none";
	$("#listform").style.display = "none";
	$("#customjoinform").style.display = "none";

	$(id).style.display = "block";
}

function quickstart() {
	refresh(function(list){
		var defaultChannelName = "Dungeon";
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
}

function startTimer(seconds) {
	var now = new Date();
	var end = new Date(now.getTime() + seconds * 1000);
	setInterval(function() {
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

		window.location.href = "/game.html";
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

		console.log(options)
		return

		localStorage["customname"] = channelName;
		
		var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    if(typeof callback == 'function') {
                    	callback(JSON.parse(xhr.responseText).success);
                    }
                } else {
                	console.log(xhr.responseText)
                    alert(JSON.parse(xhr.responseText).error)
                }
            }
        }
        xhr.open("POST", "/api", true);
        xhr.send(JSON.stringify({command:"createChannel", options: options}));
	}
}

$("#refresh").onclick = refresh;
refresh();
setInterval(refresh, 5000);

