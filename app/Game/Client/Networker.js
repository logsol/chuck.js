define([
    "Lib/Utilities/Protocol/Helper",
    "Game/Client/GameController",
    "Game/Client/User",
    "Lib/Utilities/NotificationCenter",
    "Game/Config/Settings",
    "Game/Client/View/DomController"
],

function (ProtocolHelper, GameController, User, nc, Settings, domController) {

	"use strict";

    function Networker (socketLink, channelName, nickname) {

        this.channelName = channelName;
        this.nickname = nickname;
        this.socketLink = socketLink;
        this.gameController = null;
        this.users = {};

        // WebRTC state
        this.useWebrtcRequested = readWebRtcPreference();
        this.peerConnection = null;
        this.unreliableChannel = null;
        this.unreliableReady = false;
        this.activeTransport = "socketio";

        // Stats accumulators (sliding 1s windows + RTT bucket since last report)
        this.rttBucket = [];
        this.sendTimestamps = [];
        this.recvTimestamps = [];
        this.gapCount = 0;
        this.lastWorldUpdateSeq = 0;

        this.socketLink.on('connect', this.onConnect.bind(this));
        this.socketLink.on('disconnect', this.onDisconnect.bind(this));

        var self = this;
        this.socketLink.on('message', function (message) {
            self.handleIncoming(message, "socketio");
        });

        nc.on(nc.ns.client.to.server.gameCommand.send, this.sendGameCommand, this);
        nc.on(nc.ns.core.game.events.level.loaded, this.onLevelLoaded, this);

        domController.setNick(nickname);
        domController.setTransport && domController.setTransport("socket.io");

        // Periodic stats report (over Socket.IO so it always reaches the server)
        setInterval(this.reportStats.bind(this), 1000);
    }

    function readWebRtcPreference() {
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.get("webrtc") === "0") return false;
            if (params.get("webrtc") === "1") return true;
        } catch (_) {}
        return Settings.USE_WEBRTC !== false;
    }

    // ---------------- Socket.IO lifecycle ----------------

    Networker.prototype.onConnect = function () {
        console.log('connected.');
        if (this.channelName) {
            this.sendCommand('join', { channelName: this.channelName, nickname: this.nickname });
            domController.setConnected(true);
            if (this.useWebrtcRequested) this.startWebrtc();
        } else {
            alert("Error: no channel name");
            window.location.href = "/";
        }
    };

    Networker.prototype.onDisconnect = function () {
        console.log('disconnected. game destroyed. no auto-reconnect');
        domController.setConnected(false);
        this.teardownWebrtc();
    };

    Networker.prototype.handleIncoming = function (message, transport) {
        if (Settings.NETWORK_LOG_INCOMING) {
            var skip = false;
            for (var i = 0; i < Settings.NETWORK_LOG_FILTER.length; i++) {
                if (message.indexOf(Settings.NETWORK_LOG_FILTER[i]) !== -1) { skip = true; break; }
            }
            if (!skip) console.log('INCOMING(' + transport + ')', message);
        }

        // Track worldUpdate seq gaps for stats. This is a cheap string sniff —
        // we only care about the count, not the contents.
        if (transport === "webrtc" || transport === "socketio") {
            this.recvTimestamps.push(performance.now());
        }

        try {
            ProtocolHelper.applyCommand(message, this);
        } catch (e) {
            console.warn("applyCommand failed:", e.message, message);
        }
    };

    Networker.prototype.onJoinSuccess = function (options) {
        console.log("join success");
        this.onUserJoined(options.user, true);
        this.meUserId = options.user.id;
        if (options.joinedUsers) {
            for (var i = 0; i < options.joinedUsers.length; i++) {
                this.onUserJoined(options.joinedUsers[i]);
            }
        }
        this.initPing();
    };

    Networker.prototype.onJoinError = function(options) {
        alert(options.message);
        window.location.href = "/";
    };

    Networker.prototype.onLevelLoaded = function() {
        this.gameController.onLevelLoaded();
        this.sendGameCommand("clientReady");
    };

    Networker.prototype.initPing = function() {
        this.ping();
    };

    Networker.prototype.ping = function() {
        this.lastPingSentAt = performance.now();
        this.sendCommand("ping", Date.now());
    };

    // ---------------- Sending ----------------

    Networker.prototype.sendCommand = function (command, options) {
        var message = ProtocolHelper.encodeCommand(command, options);
        this.socketLink.send(message);
        this.logOutgoing(message, "socketio");
    };

    Networker.prototype.sendGameCommand = function(command, options) {
        var inner = ProtocolHelper.encodeCommand(command, options);
        var message = ProtocolHelper.encodeCommand("gameCommand", inner);
        if (this.unreliableReady) {
            try {
                this.unreliableChannel.send(message);
                this.sendTimestamps.push(performance.now());
                this.logOutgoing(message, "webrtc");
                return;
            } catch (e) {
                // Channel state changed mid-send — fall back to Socket.IO.
            }
        }
        this.socketLink.send(message);
        this.sendTimestamps.push(performance.now());
        this.logOutgoing(message, "socketio");
    };

    Networker.prototype.logOutgoing = function (message, transport) {
        if (!Settings.NETWORK_LOG_OUTGOING) return;
        for (var i = 0; i < Settings.NETWORK_LOG_FILTER.length; i++) {
            if (message.indexOf(Settings.NETWORK_LOG_FILTER[i]) !== -1) return;
        }
        console.log('OUTGOING(' + transport + ')', message);
    };

    // ---------------- Inbound command handlers ----------------

    Networker.prototype.onUserJoined = function (options, isMe) {
        var user = new User(options.id, options);
        this.users[user.id] = user;
        if (!isMe && this.gameController && this.gameController.level && this.gameController.level.isLoaded) {
            this.gameController.createPlayer(user);
        }
    };

    Networker.prototype.onUserLeft = function (userId) {
        this.gameController.onUserLeft(userId);
        delete this.users[userId];
    };

    Networker.prototype.onGameCommand = function(message) {
        if (this.gameController) {
            this.gameController.onGameCommand(message);
        } else {
            console.warn("Networker.onGameCommand: this.gameController is undefined", message);
        }
    };

    Networker.prototype.onPong = function(timestamp) {
        var ping = (Date.now() - parseInt(timestamp, 10));
        domController.setPing(ping);
        this.rttBucket.push(ping);
        setTimeout(this.ping.bind(this), 1000);
    };

    Networker.prototype.onBeginRound = function(options) {
        if (this.gameController) this.gameController.destroy();
        this.gameController = new GameController(options);
        this.gameController.createMe(this.users[this.meUserId]);
        for (var userId in this.users) {
            if (this.meUserId != userId) this.gameController.createPlayer(this.users[userId]);
        }
        this.gameController.beginRound();
    };

    Networker.prototype.onEndRound = function() {
        this.gameController.endRound();
    };

    // ---------------- WebRTC setup ----------------

    Networker.prototype.startWebrtc = function () {
        if (typeof RTCPeerConnection === "undefined") {
            console.warn("[webrtc] RTCPeerConnection not available");
            return;
        }
        var self = this;
        try {
            var iceServers = (Settings.WEBRTC_STUN_SERVERS || ["stun:stun.l.google.com:19302"])
                .map(function (url) { return { urls: url }; });
            this.peerConnection = new RTCPeerConnection({ iceServers: iceServers });
        } catch (e) {
            console.warn("[webrtc] PeerConnection ctor failed:", e.message);
            return;
        }

        this.unreliableChannel = this.peerConnection.createDataChannel("unreliable", {
            ordered: false,
            maxRetransmits: 0
        });

        this.unreliableChannel.onopen = function () {
            console.log("[webrtc] unreliable channel open");
            self.unreliableReady = true;
            self.activeTransport = "webrtc";
            domController.setTransport && domController.setTransport("webrtc");
        };
        this.unreliableChannel.onclose = function () {
            console.log("[webrtc] unreliable channel closed");
            self.unreliableReady = false;
            self.activeTransport = "socketio";
            domController.setTransport && domController.setTransport("socket.io");
        };
        this.unreliableChannel.onmessage = function (e) {
            self.handleIncoming(e.data, "webrtc");
        };
        this.unreliableChannel.onerror = function (e) {
            console.warn("[webrtc] channel error:", e && e.message);
        };

        this.peerConnection.onicecandidate = function (e) {
            if (e.candidate) {
                self.sendCommand("webrtcIce", {
                    candidate: e.candidate.candidate,
                    mid: e.candidate.sdpMid
                });
            }
        };
        this.peerConnection.onconnectionstatechange = function () {
            console.log("[webrtc] state:", self.peerConnection.connectionState);
        };

        this.peerConnection.createOffer()
            .then(function (offer) { return self.peerConnection.setLocalDescription(offer); })
            .then(function () {
                var d = self.peerConnection.localDescription;
                self.sendCommand("webrtcOffer", { sdp: d.sdp, type: d.type });
            })
            .catch(function (err) {
                console.warn("[webrtc] offer creation failed:", err.message);
            });
    };

    Networker.prototype.onWebrtcAnswer = function (options) {
        if (!this.peerConnection || !options) return;
        this.peerConnection.setRemoteDescription({ type: options.type || "answer", sdp: options.sdp })
            .catch(function (e) { console.warn("[webrtc] setRemoteDescription failed:", e.message); });
    };

    Networker.prototype.onWebrtcIce = function (options) {
        if (!this.peerConnection || !options) return;
        var init = { candidate: options.candidate, sdpMid: options.mid };
        this.peerConnection.addIceCandidate(init)
            .catch(function (e) { console.warn("[webrtc] addIceCandidate failed:", e.message); });
    };

    Networker.prototype.teardownWebrtc = function () {
        try { if (this.unreliableChannel) this.unreliableChannel.close(); } catch (_) {}
        try { if (this.peerConnection) this.peerConnection.close(); } catch (_) {}
        this.unreliableChannel = null;
        this.peerConnection = null;
        this.unreliableReady = false;
    };

    // ---------------- Stats reporting ----------------

    Networker.prototype.reportStats = function () {
        if (!this.socketLink) return;
        var now = performance.now();
        this.sendTimestamps = this.sendTimestamps.filter(function (t) { return now - t < 1000; });
        this.recvTimestamps = this.recvTimestamps.filter(function (t) { return now - t < 1000; });
        var bucket = this.rttBucket;
        this.rttBucket = [];
        this.sendCommand("stats", {
            transport: this.activeTransport,
            rttSamples: bucket,
            recvRate: this.recvTimestamps.length,
            sendRate: this.sendTimestamps.length,
            gaps: this.gapCount
        });
    };

    return Networker;

});
