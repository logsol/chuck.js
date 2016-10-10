define([
    "Lib/Utilities/NotificationCenter",
    "Game/Channel/Channel",
    "Game/Config/Settings",
    "fs"
],

function (nc, Channel, Settings, fs) {

	"use strict";

    function PipeToServer (process) {
        this.channel = null;
        this.process = process;
        this.recordingFileName = null;

        nc.on(nc.ns.channel.to.server.controlCommand.send, this.send, this);

        process.on("message", this.onProcessMessage.bind(this));   
    }

    PipeToServer.prototype.onProcessMessage = function (message, handle) { // jshint unused:false

        if(message.data.hasOwnProperty("CREATE")) {
            this.channel = new Channel(this, message.data.options);

            message.data.options.playingFileName = Settings.CHANNEL_PLAY_RECORDING;

            if(message.data.options.playingFileName) {
                var self = this;
                setTimeout(function() {
                    console.log(message.data.options.playingFileName);
                    self.play(message.data.options.playingFileName);
                }, 2000); // giving channel time to set everything up
            }
            
            if(Settings.CHANNEL_RECORD_SESSION) {

                this.recordingFileName = Settings.CHANNEL_RECORDING_PATH +
                    this.channel.name +
                    "-" +
                    (new Date()).toISOString() +
                    "-" +
                    message.data.options.levelUids.join("_") +
                    ".log";

                if(!fs.existsSync(Settings.CHANNEL_RECORDING_PATH)) {
                    fs.mkdirSync(Settings.CHANNEL_RECORDING_PATH);
                }

                setInterval(this.recordWorldUpdate.bind(this), 1000);
                console.checkpoint("Started recording to: " + this.recordingFileName);
            }

        } else if (message.data.hasOwnProperty("KILL")) {
            this.channel.destroy();
        } else {
            this.onMessage(message);

            if(Settings.CHANNEL_RECORD_SESSION && this.channel && this.channel.name) {
                var m = JSON.stringify(message);
                var timestamp = Date.now();
                var line = "m" + timestamp + m + "\n";

                fs.appendFile(this.recordingFileName, line, function (err) {
                  if (err) throw err;
                });
            }
        }

    };

    PipeToServer.prototype.send = function (recipient, data) {
        var message = {
            recipient: recipient,
            data: data
        };

        this.process.send(message);
    };

    PipeToServer.prototype.onMessage = function (message) {
        switch(message.recipient) {
            case "channel":
                nc.trigger(nc.ns.channel.events.controlCommand.channel, message);    
                break;
            default: 
                nc.trigger(nc.ns.channel.events.controlCommand.user + message.recipient, message);    
                break;
        }
        
    };

    PipeToServer.prototype.play = function(playingFileName) {
        var self = this;
        var data = fs.readFileSync(Settings.CHANNEL_RECORDING_PATH + playingFileName);    
        var lines = data.toString().split("\n");
        var start = 0;
        for (var i = 0; i < lines.length; i++) {
            // bind message variable
            (function() {
                var line = lines[i];
                if(line.length > 0) {
                    var type = line.substring(0, 1);
                    var time = parseInt(line.substring(1, Date.now().toString().length + 1), 10);
                    if(i === 0) {
                        start = time;
                    }
                    time -= start;

                    var jsonString = line.substring(Date.now().toString().length + 1);
                    var message = JSON.parse(jsonString);

                    setTimeout(function() {
                        console.log(line);

                        if(type == "m") {
                            self.onProcessMessage(message, null);
                        } else if(type == "w") {
                            if(self.channel.gameController) {
                                self.channel.gameController.onWorldUpdate(message);
                            }
                        }
                    }, time);                
                }
            })();
        }
    };

    PipeToServer.prototype.recordWorldUpdate = function() {
        if(this.channel.gameController) {
            var update = this.channel.gameController.getWorldUpdateObject(true);
            var worldUpdate = JSON.stringify(update);
            var timestamp = Date.now();
            var line = "w" + timestamp + worldUpdate + "\n";

            fs.appendFile(this.recordingFileName, line, function (err) {
              if (err) throw err;
            });
        }
    };

    PipeToServer.prototype.destroy = function() {
        this.send("coordinator", {destroy:this.channel.name});
        this.process.exit(0);
    };

    return PipeToServer;

});