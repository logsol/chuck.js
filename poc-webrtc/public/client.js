// WebRTC DataChannel client. Signaling over WebSocket, then two channels:
//   - reliable:   default settings, used for welcome/control
//   - unreliable: ordered:false, maxRetransmits:0 — used for game state + pings

(function () {
    const POC = window.POC;
    POC.setStatus("signaling…", "wait");

    const wsProto = location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(wsProto + "://" + location.host + "/signal");

    const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    // Create both channels client-side so the server's onDataChannel fires for both.
    const reliable = pc.createDataChannel("reliable");
    const unreliable = pc.createDataChannel("unreliable", {
        ordered: false,
        maxRetransmits: 0
    });

    function wireChannel(ch, label) {
        ch.onopen = () => {
            POC.log(`channel '${label}' open`);
            if (label === "unreliable") {
                POC.attach((obj) => {
                    if (ch.readyState === "open") ch.send(JSON.stringify(obj));
                });
                POC.setStatus("connected (webrtc unreliable)", "ok");
            }
        };
        ch.onclose = () => {
            POC.log(`channel '${label}' closed`);
            POC.setStatus("disconnected", "bad");
        };
        ch.onerror = (e) => POC.log(`channel '${label}' error: ${e.message || e}`);
        ch.onmessage = (e) => {
            try { POC.handleMessage(JSON.parse(e.data)); }
            catch (err) { POC.log("parse error: " + err.message); }
        };
    }
    wireChannel(reliable, "reliable");
    wireChannel(unreliable, "unreliable");

    pc.onicecandidate = (e) => {
        if (e.candidate) {
            ws.send(JSON.stringify({
                type: "ice",
                candidate: e.candidate.candidate,
                mid: e.candidate.sdpMid
            }));
        }
    };
    pc.onconnectionstatechange = () => {
        POC.log("pc state: " + pc.connectionState);
        if (pc.connectionState === "failed") POC.setStatus("failed", "bad");
    };

    ws.onopen = async () => {
        POC.log("signaling open, creating offer");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: "sdp", sdp: offer.sdp, sdpType: offer.type }));
    };
    ws.onmessage = async (e) => {
        const m = JSON.parse(e.data);
        if (m.type === "sdp") {
            await pc.setRemoteDescription({ type: m.sdpType, sdp: m.sdp });
            POC.log("got remote sdp (" + m.sdpType + ")");
        } else if (m.type === "ice") {
            try {
                await pc.addIceCandidate({ candidate: m.candidate, sdpMid: m.mid });
            } catch (err) {
                POC.log("addIceCandidate error: " + err.message);
            }
        }
    };
    ws.onclose = () => POC.log("signaling closed");
})();
