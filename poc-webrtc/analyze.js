// Reads a run JSONL file and prints a per-(transport, phase) summary.
// Usage:  node analyze.js [runs/<file>.jsonl]
// If no file given, uses the most recent file in runs/.

"use strict";

const fs = require("fs");
const path = require("path");

function pickFile() {
    if (process.argv[2]) return process.argv[2];
    const dir = path.join(__dirname, "runs");
    const files = fs.readdirSync(dir)
        .filter((f) => f.endsWith(".jsonl"))
        .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
        .sort((a, b) => b.t - a.t);
    if (!files.length) {
        console.error("No run files in " + dir);
        process.exit(1);
    }
    return path.join(dir, files[0].f);
}

const file = pickFile();
console.log("Analyzing: " + file + "\n");

const lines = fs.readFileSync(file, "utf8").trim().split("\n");
const events = lines.map((l) => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);

// Group stats events by (session, transport) → phase
// Phase is the most recent "phase" event for that session before this stats event.
const sessionPhase = new Map();
const bucket = new Map(); // key: transport|phase → samples

function bucketKey(transport, phase) { return transport + "|" + phase; }

for (const e of events) {
    if (e.type === "session_start") {
        sessionPhase.set(e.session, "unmarked");
    } else if (e.type === "phase") {
        sessionPhase.set(e.session, e.label || "unmarked");
    } else if (e.type === "stats") {
        const phase = sessionPhase.get(e.session) || "unmarked";
        const k = bucketKey(e.transport, phase);
        if (!bucket.has(k)) {
            bucket.set(k, {
                transport: e.transport, phase,
                rtt: [], recvRate: [], sendRate: [], seqGaps: [], reports: 0
            });
        }
        const b = bucket.get(k);
        b.reports++;
        for (const r of e.rttSamples) b.rtt.push(r);
        b.recvRate.push(e.recvRate);
        b.sendRate.push(e.sendRate);
        b.seqGaps.push(e.seqGaps);
    }
}

function pct(arr, p) {
    if (!arr.length) return NaN;
    const s = arr.slice().sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(s.length * p))];
}
function mean(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN; }
function fmt(n) { return Number.isFinite(n) ? n.toFixed(1) : "  -  "; }
function pad(s, n) { s = String(s); return s + " ".repeat(Math.max(0, n - s.length)); }

if (!bucket.size) {
    console.log("No stats events found in run.");
    process.exit(0);
}

const header = [
    pad("transport", 10), pad("phase", 18),
    pad("samples", 8), pad("rtt p50", 10), pad("rtt p95", 10),
    pad("rtt p99", 10), pad("rtt max", 10),
    pad("recvHz", 8), pad("gapsΔ", 8)
].join(" ");
console.log(header);
console.log("-".repeat(header.length));

const keys = [...bucket.keys()].sort();
for (const k of keys) {
    const b = bucket.get(k);
    const gapsDelta = b.seqGaps.length ? b.seqGaps[b.seqGaps.length - 1] - b.seqGaps[0] : 0;
    console.log([
        pad(b.transport, 10),
        pad(b.phase, 18),
        pad(b.rtt.length, 8),
        pad(fmt(pct(b.rtt, 0.5)), 10),
        pad(fmt(pct(b.rtt, 0.95)), 10),
        pad(fmt(pct(b.rtt, 0.99)), 10),
        pad(fmt(Math.max(0, ...b.rtt)), 10),
        pad(fmt(mean(b.recvRate)), 8),
        pad(gapsDelta, 8)
    ].join(" "));
}

console.log("\nLegend: rtt in ms, recvHz = worldUpdates/sec, gapsΔ = seq gaps observed during phase");
