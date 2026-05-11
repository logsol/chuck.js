define([
    "Game/Core/User",
    "Lib/Utilities/Protocol/Helper",
    "Lib/Utilities/NotificationCenter",
    "Server/WebRTCTransport",
    "Server/StatsLogger"
],

function (Parent, ProtocolHelper, nc, WebRTCTransport, StatsLogger) {

	"use strict";

    function User (socketLink, coordinator) {
        Parent.call(this, socketLink.id, {});

        this.coordinator = coordinator;
        this.socketLink = socketLink;
        this.channelPipe = null;
        this.options = null;

        var self = this;

        socketLink.on('message', this.onMessage.bind(this));
        socketLink.on('disconnect', this.onDisconnect.bind(this));

        // Outbound messages from the rest of the server land here. We decide
        // whether to send over Socket.IO (control) or the WebRTC unreliable
        // channel (gameCommand, when ready).
        nc.on(nc.ns.server.events.controlCommand.user + this.id, this.sendOutbound, this);

        // Spin up the WebRTC peer immediately. Negotiation happens via the
        // socket signaling messages once the client posts its offer.
        this.webrtc = new WebRTCTransport(this.id, {
            onLocalDescription: function (desc) {
                self.socketLink.send(ProtocolHelper.encodeCommand("webrtcAnswer", desc));
            },
            onLocalCandidate: function (cand) {
                self.socketLink.send(ProtocolHelper.encodeCommand("webrtcIce", cand));
            },
            onReady: function (negotiationMs) {
                console.log("[webrtc] " + self.id + " unreliable channel open (" + negotiationMs + "ms)");
                StatsLogger.log({
                    type: "webrtc_ready",
                    session: self.id,
                    dtMs: negotiationMs
                });
            },
            onMessage: function (raw) {
                // Inbound gameCommand from client over the unreliable channel.
                // Same shape as if it came over Socket.IO: a JSON-encoded
                // gameCommand envelope. Feed it to applyCommand the same way.
                try {
                    var parsed = JSON.parse(raw);
                    if (parsed.gameCommand !== undefined) {
                        self.onGameCommand(parsed.gameCommand);
                    } else {
                        // Future: other unreliable-channel message types.
                        ProtocolHelper.applyCommand(raw, self);
                    }
                } catch (e) {
                    console.warn("[webrtc] bad inbound message:", e.message);
                }
            },
            onClosed: function () {
                console.log("[webrtc] " + self.id + " unreliable channel closed");
            }
        });

        StatsLogger.log({
            type: "session_start",
            session: this.id,
            hasWebrtc: true
        });
    }

    User.prototype = Object.create(Parent.prototype);

    // ---------- Inbound from Socket.IO ----------

    User.prototype.onMessage = function (message) {
        ProtocolHelper.applyCommand(message, this);
    };

    User.prototype.onDisconnect = function () {
        if (this.webrtc) {
            this.webrtc.destroy();
            this.webrtc = null;
        }
        StatsLogger.log({ type: "session_end", session: this.id });

        if(!this.channelPipe) {
            console.warn("Disconnecting user without a channel. (Maybe channel was full)");
            return;
        }

        this.channelPipe.removeUser(this);
    };


    // ---------- Outbound routing ----------

    // Decides whether a server-generated message should ride Socket.IO or the
    // unreliable WebRTC channel. gameCommand traffic uses WebRTC when ready;
    // everything else stays on Socket.IO.
    User.prototype.sendOutbound = function (message) {
        if (this.webrtc && this.webrtc.isReady() && isGameCommandMessage(message)) {
            if (this.webrtc.send(message)) return;
            // Send failed (channel state changed mid-send) — fall through.
        }
        this.socketLink.send(message);
    };

    function isGameCommandMessage(message) {
        // The protocol wraps every message as {"<command>": <payload>}; we only
        // peek at the first key without fully parsing the inner payload.
        if (typeof message !== "string") return false;
        // Cheap heuristic — robust because the envelope key is always first.
        return message.indexOf('{"gameCommand"') === 0;
    }


    // ---------- Command callbacks (received from client) ----------

    User.prototype.onJoin = function(options) {

        var channelPipe = this.coordinator.getChannelPipeByName(options.channelName);

        if(!channelPipe) {
            var message = ProtocolHelper.encodeCommand("joinError", {message:"Channel " + options.channelName + " not found."});
            this.socketLink.send(message);
            return;
        }

        if (channelPipe.isFull()) {
            var message = ProtocolHelper.encodeCommand("joinError", {message:"Sorry! Channel " + options.channelName + " is full."});
            this.socketLink.send(message);
            return;
        }

        this.channelPipe = channelPipe;

        var userOptions = {
            id: this.id,
            nickname: options.nickname
        };
        this.options = userOptions;
        this.channelPipe.addUser(this);
    };

    User.prototype.onGameCommand = function(options) {
        var message = ProtocolHelper.encodeCommand("gameCommand", options);
        this.channelPipe.sendToUser(this.id, message);
    };

    User.prototype.onPing = function(timestamp) {
        var message = ProtocolHelper.encodeCommand("pong", timestamp);
        nc.trigger(nc.ns.server.events.controlCommand.user + this.id, message);
    };

    // WebRTC signaling messages from the client (arriving over Socket.IO).

    User.prototype.onWebrtcOffer = function (options) {
        if (!this.webrtc || !options) return;
        this.webrtc.handleRemoteDescription(options.sdp, options.type || "offer");
    };

    User.prototype.onWebrtcIce = function (options) {
        if (!this.webrtc || !options) return;
        this.webrtc.handleRemoteCandidate(options.candidate, options.mid);
    };

    // Periodic stats report from client.
    User.prototype.onStats = function (options) {
        if (!options) return;
        StatsLogger.log({
            type: "stats",
            session: this.id,
            transport: options.transport || "socketio",
            rttSamples: options.rttSamples || [],
            recvRate: options.recvRate || 0,
            sendRate: options.sendRate || 0,
            gaps: options.gaps || 0
        });
    };

    return User;
});
