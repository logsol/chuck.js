"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { WebSocketServer } = require("ws");
const { Server: SocketIOServer } = require("socket.io");
const nodeDataChannel = require("node-datachannel");

const PORT = 1235;

// ---------------- Run logging ----------------

const RUN_FILE = path.join(__dirname, "runs", new Date().toISOString().replace(/[:.]/g, "-") + ".jsonl");
fs.mkdirSync(path.dirname(RUN_FILE), { recursive: true });
fs.writeFileSync(RUN_FILE, JSON.stringify({ type: "run_start", t: Date.now() }) + "\n");
console.log("Run log: " + RUN_FILE);

function logEvent(obj) {
    obj.t = obj.t || Date.now();
    fs.appendFile(RUN_FILE, JSON.stringify(obj) + "\n", () => {});
}
const TICK_HZ = 60;
const BROADCAST_HZ = 14;
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;
const SPEED = 240;

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

// ---------------- Shared game state ----------------

const boxes = {};
let nextBoxId = 1;

function createBox() {
    const id = "b" + nextBoxId++;
    boxes[id] = {
        id,
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2,
        vx: 0,
        vy: 0,
        lastInputSeq: 0
    };
    return id;
}

function destroyBox(id) {
    delete boxes[id];
}

function applyInput(boxId, input) {
    const b = boxes[boxId];
    if (!b) return;
    if (input.seq !== undefined) b.lastInputSeq = input.seq;
    if (input.cmd === "left") b.vx = -SPEED;
    else if (input.cmd === "right") b.vx = SPEED;
    else if (input.cmd === "stop") b.vx = 0;
    else if (input.cmd === "jump") b.vy = -SPEED * 1.5;
}

// Common handler for stats/phase messages so both transports log identically.
function handleClientReport(session, transport, data) {
    if (data.type === "stats") {
        logEvent({
            type: "stats",
            session, transport,
            rttSamples: data.rttSamples || [],
            recvRate: data.recvRate || 0,
            sendRate: data.sendRate || 0,
            lastSeq: data.lastSeq || 0,
            seqGaps: data.seqGaps || 0,
            outstanding: data.outstanding || 0
        });
    } else if (data.type === "phase") {
        logEvent({ type: "phase", session, transport, label: data.label || "" });
        console.log(`[${transport}] phase: ${data.label}`);
    }
}

setInterval(() => {
    const dt = 1 / TICK_HZ;
    for (const id in boxes) {
        const b = boxes[id];
        b.x += b.vx * dt;
        b.y += b.vy * dt + 0.5 * 800 * dt * dt;
        b.vy += 800 * dt;
        if (b.x < 0) { b.x = 0; b.vx = 0; }
        if (b.x > WORLD_WIDTH) { b.x = WORLD_WIDTH; b.vx = 0; }
        if (b.y > WORLD_HEIGHT - 20) {
            b.y = WORLD_HEIGHT - 20;
            b.vy = 0;
        }
    }
}, 1000 / TICK_HZ);

function snapshotWorld() {
    const out = {};
    for (const id in boxes) {
        const b = boxes[id];
        out[id] = { x: b.x, y: b.y, ack: b.lastInputSeq };
    }
    return out;
}

// ---------------- WebRTC signaling + peer management ----------------

const wss = new WebSocketServer({ server, path: "/signal" });
const rtcPeers = new Map();
let nextPeerId = 1;

let rtcBroadcastSeq = 0;
setInterval(() => {
    rtcBroadcastSeq++;
    const msg = JSON.stringify({
        type: "worldUpdate",
        seq: rtcBroadcastSeq,
        t: Date.now(),
        boxes: snapshotWorld()
    });
    for (const peer of rtcPeers.values()) {
        const ch = peer.unreliable;
        if (ch && ch.isOpen()) {
            try { ch.sendMessage(msg); } catch (_) {}
        }
    }
}, 1000 / BROADCAST_HZ);

wss.on("connection", (ws) => {
    const peerId = "p" + nextPeerId++;
    const boxId = createBox();
    console.log(`[webrtc] signaling open ${peerId} → box ${boxId}`);

    const pc = new nodeDataChannel.PeerConnection(peerId, {
        iceServers: ["stun:stun.l.google.com:19302"]
    });

    const peer = { pc, boxId, reliable: null, unreliable: null };
    rtcPeers.set(peerId, peer);
    logEvent({ type: "session_start", session: peerId, transport: "webrtc", boxId });

    pc.onLocalDescription((sdp, type) => {
        ws.send(JSON.stringify({ type: "sdp", sdp, sdpType: type }));
    });
    pc.onLocalCandidate((candidate, mid) => {
        ws.send(JSON.stringify({ type: "ice", candidate, mid }));
    });

    pc.onDataChannel((dc) => {
        const label = dc.getLabel();
        if (label === "reliable") peer.reliable = dc;
        else if (label === "unreliable") peer.unreliable = dc;

        dc.onOpen(() => {
            console.log(`[webrtc] ${peerId} channel '${label}' open`);
            if (label === "reliable") {
                dc.sendMessage(JSON.stringify({ type: "welcome", boxId }));
            }
        });
        dc.onMessage((msg) => {
            try {
                const data = JSON.parse(msg);
                if (data.type === "input") {
                    applyInput(boxId, data);
                } else if (data.type === "ping") {
                    dc.sendMessage(JSON.stringify({ type: "pong", t: data.t }));
                } else if (data.type === "stats" || data.type === "phase") {
                    handleClientReport(peerId, "webrtc", data);
                }
            } catch (_) {}
        });
        dc.onClosed(() => console.log(`[webrtc] ${peerId} channel '${label}' closed`));
    });

    ws.on("message", (raw) => {
        try {
            const m = JSON.parse(raw);
            if (m.type === "sdp") pc.setRemoteDescription(m.sdp, m.sdpType);
            else if (m.type === "ice") pc.addRemoteCandidate(m.candidate, m.mid);
        } catch (e) {
            console.error("[webrtc] bad signaling msg", e);
        }
    });

    ws.on("close", () => {
        console.log(`[webrtc] signaling closed ${peerId}`);
        try { pc.close(); } catch (_) {}
        rtcPeers.delete(peerId);
        destroyBox(boxId);
        logEvent({ type: "session_end", session: peerId, transport: "webrtc" });
    });
});

// ---------------- Socket.IO comparison transport ----------------

const io = new SocketIOServer(server, { path: "/socketio" });
const ioBoxes = new Map();
let ioBroadcastSeq = 0;

setInterval(() => {
    ioBroadcastSeq++;
    const msg = {
        type: "worldUpdate",
        seq: ioBroadcastSeq,
        t: Date.now(),
        boxes: snapshotWorld()
    };
    for (const sock of ioBoxes.keys()) {
        sock.emit("msg", msg);
    }
}, 1000 / BROADCAST_HZ);

io.on("connection", (sock) => {
    const boxId = createBox();
    ioBoxes.set(sock, boxId);
    console.log(`[socketio] connected ${sock.id} → box ${boxId}`);
    sock.emit("msg", { type: "welcome", boxId });
    logEvent({ type: "session_start", session: sock.id, transport: "socketio", boxId });

    sock.on("msg", (data) => {
        if (data.type === "input") applyInput(boxId, data);
        else if (data.type === "ping") sock.emit("msg", { type: "pong", t: data.t });
        else if (data.type === "stats" || data.type === "phase") {
            handleClientReport(sock.id, "socketio", data);
        }
    });
    sock.on("disconnect", () => {
        console.log(`[socketio] disconnected ${sock.id}`);
        destroyBox(boxId);
        ioBoxes.delete(sock);
        logEvent({ type: "session_end", session: sock.id, transport: "socketio" });
    });
});

server.listen(PORT, () => {
    console.log(`POC server listening on http://localhost:${PORT}`);
    console.log(`  WebRTC test:  http://localhost:${PORT}/?transport=webrtc`);
    console.log(`  Socket.IO:    http://localhost:${PORT}/?transport=socketio`);
});

process.on("SIGINT", () => {
    nodeDataChannel.cleanup();
    process.exit(0);
});
