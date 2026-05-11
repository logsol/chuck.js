// Headless-Chromium smoke test of the integrated WebRTC transport.
//
// Spawns the chuck.js server, creates a channel via the API, launches Chromium,
// loads the game, watches the DOM "transport" indicator and the runs/*.jsonl
// log to confirm the unreliable DataChannel actually opened end-to-end.

"use strict";

const { chromium } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const SERVER_URL = "http://localhost:1234";
const CHANNEL = "browsersmoke";

function apiCall(body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
            host: "localhost", port: 1234, path: "/api", method: "POST",
            headers: { "Content-Type": "application/json", "Content-Length": data.length }
        }, (res) => {
            let chunks = "";
            res.on("data", (c) => (chunks += c));
            res.on("end", () => resolve(JSON.parse(chunks)));
        });
        req.on("error", reject);
        req.write(data); req.end();
    });
}

async function waitForServerReady() {
    for (let i = 0; i < 30; i++) {
        try {
            const r = await apiCall({ command: "getMaps" });
            if (r.success) return;
        } catch (_) {}
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error("server not ready");
}

function fileLog(pid, label, line) {
    console.log("[" + label + ":" + pid + "] " + line.trim());
}

async function main() {
    const srvLogPath = "/tmp/chuck-srv.log";
    fs.writeFileSync(srvLogPath, "");
    const srv = spawn("node", ["server.js"], {
        cwd: process.cwd(),
        stdio: ["ignore", fs.openSync(srvLogPath, "a"), fs.openSync(srvLogPath, "a")],
        env: process.env
    });
    console.log("[test] server pid=" + srv.pid);

    try {
        await waitForServerReady();
        console.log("[test] server up");

        const r = await apiCall({
            command: "createChannel",
            options: { channelName: CHANNEL, levelUids: ["debug"], maxUsers: 4, minUsers: 1, scoreLimit: 5 }
        });
        if (!r.success) throw new Error("createChannel failed: " + JSON.stringify(r));
        console.log("[test] channel created");

        // Find the run file the server just opened.
        await new Promise((r) => setTimeout(r, 500));
        const runFiles = fs.readdirSync("runs").filter((f) => f.endsWith(".jsonl"))
            .map((f) => ({ f, t: fs.statSync(path.join("runs", f)).mtimeMs }))
            .sort((a, b) => b.t - a.t);
        const runFile = path.join("runs", runFiles[0].f);
        console.log("[test] run file: " + runFile);

        const browser = await chromium.launch({
            executablePath: "/usr/sbin/chromium",
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-fake-ui-for-media-stream"]
        });
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        page.on("console", (msg) => console.log("[browser]", msg.type(), msg.text()));
        page.on("pageerror", (err) => console.error("[browser ERR]", err.message));

        const url = SERVER_URL + "/#" + CHANNEL;
        console.log("[test] navigating to " + url);
        await page.goto(url, { waitUntil: "load" });

        // Diagnostics: dump form visibility states and the latest /api response.
        await page.waitForTimeout(2000);
        const diag = await page.evaluate(() => ({
            joinDisplay: getComputedStyle(document.getElementById("customjoinform")).display,
            createDisplay: getComputedStyle(document.getElementById("createform")).display,
            listDisplay: getComputedStyle(document.getElementById("listform")).display,
            hash: window.location.hash,
            customname: document.getElementById("customname").value
        }));
        console.log("[test] form states:", JSON.stringify(diag));

        // If the hashchange didn't auto-show the form, force the showCustomJoinForm path.
        if (diag.joinDisplay !== "block") {
            console.log("[test] forcing showCustomJoinForm");
            await page.evaluate(() => {
                document.getElementById("customname").value = location.hash.substr(1);
                document.getElementById("customjoinform").style.display = "block";
            });
        }
        await page.waitForSelector("#customjoinform", { state: "visible", timeout: 8000 });
        console.log("[test] customjoinform visible");

        // Fill in nickname and submit the form.
        await page.evaluate(() => {
            document.getElementById("nick").value = "browser-bot";
            const form = document.getElementById("customjoinform");
            // The form's onsubmit returns false to prevent navigation. Calling
            // onsubmit() directly invokes the join handler.
            form.onsubmit({ preventDefault: () => {} });
        });
        console.log("[test] join submitted");

        // Wait up to 12s for the transport indicator to switch to "webrtc",
        // or for the JSONL to show a webrtc_ready event.
        const deadline = Date.now() + 12000;
        let webrtcReady = false;
        let transportText = "";
        while (Date.now() < deadline) {
            await page.waitForTimeout(500);
            transportText = await page.evaluate(() => {
                const labels = Array.from(document.querySelectorAll("label"));
                const t = labels.find((l) => /^transport:/.test(l.textContent || ""));
                return t ? t.textContent : "";
            }).catch(() => "");
            const log = fs.readFileSync(runFile, "utf8");
            if (/webrtc_ready/.test(log) || /transport:webrtc/.test(transportText)) {
                webrtcReady = true;
                break;
            }
        }

        console.log("[test] transport indicator: '" + transportText + "'");
        console.log("[test] webrtc_ready event seen: " + (webrtcReady ? "YES" : "NO"));

        // Wait a bit more to collect stats events and verify gameCommand
        // traffic is actually flowing.
        await page.waitForTimeout(3000);

        const events = fs.readFileSync(runFile, "utf8")
            .split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch (_) { return null; } })
            .filter(Boolean);
        const stats = events.filter((e) => e.type === "stats");
        const lastStat = stats[stats.length - 1];
        console.log("[test] stats events received: " + stats.length);
        if (lastStat) {
            console.log("[test] last stats: transport=" + lastStat.transport +
                " recvRate=" + lastStat.recvRate +
                " sendRate=" + lastStat.sendRate);
        }

        const webrtcInUse = lastStat && lastStat.transport === "webrtc";
        const traffic = lastStat && lastStat.recvRate > 0;

        const logTail = fs.readFileSync(runFile, "utf8").split("\n").filter(Boolean).slice(-10);
        console.log("[test] last JSONL events:");
        for (const l of logTail) console.log("  " + l);

        await browser.close();

        const pass = webrtcReady && webrtcInUse && traffic;
        console.log("\nRESULT: " + (pass ? "PASS" : "FAIL") +
            "  (webrtc_ready=" + webrtcReady + " webrtcInUse=" + !!webrtcInUse +
            " trafficFlowing=" + !!traffic + ")");
        process.exitCode = pass ? 0 : 1;
    } finally {
        srv.kill("SIGINT");
        await new Promise((r) => setTimeout(r, 500));
        srv.kill("SIGKILL");
        const tail = fs.readFileSync(srvLogPath, "utf8").split("\n").slice(-30).join("\n");
        console.log("\n--- server log tail ---\n" + tail);
    }
}

main().catch((e) => { console.error("[test] fatal:", e); process.exit(2); });
