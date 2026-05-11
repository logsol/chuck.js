define([
    "fs",
    "path"
],

function (fs, path) {

    "use strict";

    var runsDir = path.join(process.cwd(), "runs");
    if (!fs.existsSync(runsDir)) {
        fs.mkdirSync(runsDir, { recursive: true });
    }

    var runFile = path.join(
        runsDir,
        new Date().toISOString().replace(/[:.]/g, "-") + ".jsonl"
    );
    var location = process.env.POC_LOCATION || "unknown";

    fs.writeFileSync(runFile, JSON.stringify({
        type: "run_start",
        t: Date.now(),
        location: location,
        pid: process.pid
    }) + "\n");
    console.log("[stats] logging to " + runFile);

    return {
        log: function (obj) {
            obj.t = obj.t || Date.now();
            obj.location = obj.location || location;
            fs.appendFile(runFile, JSON.stringify(obj) + "\n", function () {});
        },
        getFile: function () { return runFile; },
        getLocation: function () { return location; }
    };
});
