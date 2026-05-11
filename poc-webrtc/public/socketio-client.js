// Socket.IO comparison client. Uses the same POC.attach() / POC.handleMessage()
// interface as the WebRTC client so the comparison is apples-to-apples.

(function () {
    const POC = window.POC;
    POC.setStatus("connecting (socketio)…", "wait");

    const sock = io({ path: "/socketio" });
    sock.on("connect", () => {
        POC.log("socket.io connected " + sock.id);
        POC.setStatus("connected (socket.io)", "ok");
        POC.attach((obj) => sock.emit("msg", obj));
    });
    sock.on("disconnect", () => {
        POC.log("socket.io disconnected");
        POC.setStatus("disconnected", "bad");
    });
    sock.on("connect_error", (err) => POC.log("socket.io error: " + err.message));
    sock.on("msg", (data) => POC.handleMessage(data));
})();
