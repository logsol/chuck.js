define([
    "node-datachannel"
],

function (nodeDataChannel) {

    "use strict";

    // Per-user WebRTC peer + unreliable data channel.
    // The User class relays SDP/ICE between this transport and the client
    // (over Socket.IO). This class only deals with the WebRTC peer state.
    function WebRTCTransport(userId, callbacks) {
        this.userId = userId;
        this.callbacks = callbacks || {};
        this.unreliable = null;
        this.ready = false;
        this.createdAt = Date.now();

        var iceServers = ["stun:stun.l.google.com:19302"];
        this.pc = new nodeDataChannel.PeerConnection("peer-" + userId, {
            iceServers: iceServers
        });

        var self = this;

        this.pc.onLocalDescription(function (sdp, type) {
            if (self.callbacks.onLocalDescription) {
                self.callbacks.onLocalDescription({ sdp: sdp, type: type });
            }
        });

        this.pc.onLocalCandidate(function (candidate, mid) {
            if (self.callbacks.onLocalCandidate) {
                self.callbacks.onLocalCandidate({ candidate: candidate, mid: mid });
            }
        });

        this.pc.onDataChannel(function (dc) {
            var label = dc.getLabel();
            if (label !== "unreliable") return;
            self.unreliable = dc;
            dc.onOpen(function () {
                self.ready = true;
                if (self.callbacks.onReady) {
                    self.callbacks.onReady(Date.now() - self.createdAt);
                }
            });
            dc.onMessage(function (msg) {
                if (self.callbacks.onMessage) self.callbacks.onMessage(msg);
            });
            dc.onClosed(function () {
                self.ready = false;
                if (self.callbacks.onClosed) self.callbacks.onClosed();
            });
        });
    }

    WebRTCTransport.prototype.handleRemoteDescription = function (sdp, type) {
        try {
            console.log("[webrtc] " + this.userId + " setRemoteDescription " + type);
            this.pc.setRemoteDescription(sdp, type);
            this.haveRemoteDesc = true;
            // Flush any candidates that arrived before the offer.
            if (this.pendingCandidates && this.pendingCandidates.length) {
                var pending = this.pendingCandidates;
                this.pendingCandidates = [];
                for (var i = 0; i < pending.length; i++) {
                    this.handleRemoteCandidate(pending[i].candidate, pending[i].mid);
                }
            }
        } catch (e) {
            console.error("[webrtc] setRemoteDescription failed:", e && (e.message || e));
        }
    };

    WebRTCTransport.prototype.handleRemoteCandidate = function (candidate, mid) {
        // Buffer until we have the remote description — adding candidates before
        // setRemoteDescription throws.
        if (!this.haveRemoteDesc) {
            this.pendingCandidates = this.pendingCandidates || [];
            this.pendingCandidates.push({ candidate: candidate, mid: mid });
            return;
        }
        try {
            this.pc.addRemoteCandidate(candidate, mid || "0");
        } catch (e) {
            console.error("[webrtc] addRemoteCandidate failed:", e && (e.message || e));
        }
    };

    WebRTCTransport.prototype.isReady = function () {
        return this.ready && this.unreliable && this.unreliable.isOpen();
    };

    WebRTCTransport.prototype.send = function (message) {
        if (!this.isReady()) return false;
        try {
            this.unreliable.sendMessage(message);
            return true;
        } catch (e) {
            return false;
        }
    };

    WebRTCTransport.prototype.destroy = function () {
        try { if (this.unreliable) this.unreliable.close(); } catch (_) {}
        try { this.pc.close(); } catch (_) {}
        this.ready = false;
    };

    return WebRTCTransport;
});
