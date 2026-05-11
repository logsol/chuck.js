// Shared client-side helpers: rendering, stats, input. The transport-specific
// client (client.js or socketio-client.js) calls into POC.attach() with three
// callbacks: send(obj), onmessage handler (provided by POC), and a status setter.

(function () {
    const canvas = document.getElementById("world");
    const ctx = canvas.getContext("2d");
    const rttChart = document.getElementById("rtt-chart");
    const rttCtx = rttChart.getContext("2d");

    const statusEl = document.getElementById("status");
    const statusDot = document.getElementById("status-dot");
    const rttEl = document.getElementById("rtt");
    const rttAvgEl = document.getElementById("rtt-avg");
    const rttP95El = document.getElementById("rtt-p95");
    const rateEl = document.getElementById("rate");
    const seqEl = document.getElementById("seq");
    const gapsEl = document.getElementById("gaps");
    const logEl = document.getElementById("log");

    const state = {
        myBoxId: null,
        boxes: {},
        send: null,
        pingSeq: 0,
        outstandingPings: new Map(),
        rttSamples: [],     // sliding window, last 50 (for display)
        rttBucket: [],      // accumulator since last stats report
        rateWindow: [],     // worldUpdate receive times (last 1s)
        sendWindow: [],     // send times (last 1s)
        lastSeq: 0,
        seqGaps: 0,
        inputSeq: 0
    };

    const heldKeys = new Set();
    let lastSentCmd = null;

    function setStatus(text, cls) {
        statusEl.textContent = text;
        statusDot.className = "dot " + (cls || "wait");
    }

    function log(line) {
        const ts = new Date().toISOString().substr(11, 12);
        logEl.textContent = ts + " " + line + "\n" + logEl.textContent;
        if (logEl.textContent.length > 4000) logEl.textContent = logEl.textContent.slice(0, 4000);
    }

    function handleMessage(data) {
        if (data.type === "welcome") {
            state.myBoxId = data.boxId;
            log("welcome boxId=" + data.boxId);
        } else if (data.type === "worldUpdate") {
            state.boxes = data.boxes || {};
            state.rateWindow.push(performance.now());
            if (data.seq > state.lastSeq + 1 && state.lastSeq > 0) {
                state.seqGaps += data.seq - state.lastSeq - 1;
            }
            state.lastSeq = data.seq;
        } else if (data.type === "pong") {
            const sent = state.outstandingPings.get(data.t);
            if (sent !== undefined) {
                const rtt = performance.now() - sent;
                state.outstandingPings.delete(data.t);
                state.rttSamples.push(rtt);
                state.rttBucket.push(rtt);
                if (state.rttSamples.length > 50) state.rttSamples.shift();
            }
        }
    }

    function sendRaw(obj) {
        if (!state.send) return;
        state.sendWindow.push(performance.now());
        state.send(obj);
    }

    function ping() {
        if (!state.send) return;
        const t = performance.now();
        state.outstandingPings.set(t, t);
        sendRaw({ type: "ping", t });
        // GC stale pings (older than 5s)
        for (const k of state.outstandingPings.keys()) {
            if (performance.now() - k > 5000) state.outstandingPings.delete(k);
        }
    }
    setInterval(ping, 100);

    function sendInput(cmd) {
        if (!state.send || lastSentCmd === cmd) return;
        lastSentCmd = cmd;
        state.inputSeq++;
        sendRaw({ type: "input", seq: state.inputSeq, cmd });
    }

    // Report stats to server every 1s for offline analysis
    setInterval(() => {
        if (!state.send) return;
        const now = performance.now();
        state.sendWindow = state.sendWindow.filter((t) => now - t < 1000);
        const bucket = state.rttBucket;
        state.rttBucket = [];
        sendRaw({
            type: "stats",
            rttSamples: bucket,
            recvRate: state.rateWindow.length,
            sendRate: state.sendWindow.length,
            lastSeq: state.lastSeq,
            seqGaps: state.seqGaps,
            outstanding: state.outstandingPings.size
        });
    }, 1000);

    // Phase marker buttons
    function markPhase(label) {
        sendRaw({ type: "phase", label });
        log("phase → " + label);
    }
    window.POC_MARK = markPhase;

    function tickInput() {
        const left = heldKeys.has("ArrowLeft") || heldKeys.has("a") || heldKeys.has("A");
        const right = heldKeys.has("ArrowRight") || heldKeys.has("d") || heldKeys.has("D");
        if (left && !right) sendInput("left");
        else if (right && !left) sendInput("right");
        else if (!left && !right) sendInput("stop");
    }

    window.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        heldKeys.add(e.key);
        if (e.key === " " || e.key === "Spacebar") {
            state.inputSeq++;
            if (state.send) state.send({ type: "input", seq: state.inputSeq, cmd: "jump" });
            e.preventDefault();
        } else {
            tickInput();
        }
    });
    window.addEventListener("keyup", (e) => {
        heldKeys.delete(e.key);
        tickInput();
    });

    function fmt(n) { return n.toFixed(1); }
    function p95(arr) {
        if (!arr.length) return 0;
        const sorted = arr.slice().sort((a, b) => a - b);
        return sorted[Math.floor(sorted.length * 0.95)];
    }

    function refreshStats() {
        const samples = state.rttSamples;
        if (samples.length) {
            const last = samples[samples.length - 1];
            const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
            rttEl.textContent = fmt(last) + " ms";
            rttAvgEl.textContent = fmt(avg) + " ms";
            rttP95El.textContent = fmt(p95(samples)) + " ms";
        }
        const now = performance.now();
        state.rateWindow = state.rateWindow.filter((t) => now - t < 1000);
        rateEl.textContent = String(state.rateWindow.length);
        seqEl.textContent = String(state.lastSeq);
        gapsEl.textContent = String(state.seqGaps);
    }
    setInterval(refreshStats, 200);

    function render() {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#444";
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        for (const id in state.boxes) {
            const b = state.boxes[id];
            ctx.fillStyle = id === state.myBoxId ? "#4cf" : "#cc6";
            ctx.fillRect(b.x - 15, b.y - 15, 30, 30);
            ctx.fillStyle = "#111";
            ctx.font = "10px monospace";
            ctx.fillText(id, b.x - 8, b.y + 3);
        }

        // RTT chart
        rttCtx.fillStyle = "#1c1c1c";
        rttCtx.fillRect(0, 0, rttChart.width, rttChart.height);
        const samples = state.rttSamples;
        if (samples.length > 1) {
            const max = Math.max(50, ...samples);
            rttCtx.strokeStyle = "#4cf";
            rttCtx.beginPath();
            for (let i = 0; i < samples.length; i++) {
                const x = (i / (samples.length - 1)) * rttChart.width;
                const y = rttChart.height - (samples[i] / max) * (rttChart.height - 4) - 2;
                if (i === 0) rttCtx.moveTo(x, y); else rttCtx.lineTo(x, y);
            }
            rttCtx.stroke();
            rttCtx.fillStyle = "#666";
            rttCtx.font = "9px monospace";
            rttCtx.fillText(max.toFixed(0) + "ms", 2, 10);
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.POC = {
        attach(send) { state.send = send; },
        setStatus,
        log,
        handleMessage
    };
})();
