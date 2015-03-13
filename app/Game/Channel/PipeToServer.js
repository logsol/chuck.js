define([
    "Lib/Utilities/NotificationCenter",
    "Game/Channel/Channel",
    "Game/Config/Settings",
    'fs',
    'util',
],

function (Nc, Channel, Settings, fs, util) {

	"use strict";

    function PipeToServer (process) {
        this.channel = null;
        this.process = process;
        this.recordingFileName = null;

        Nc.on(Nc.ns.channel.to.server.controlCommand.send, this.send, this);

        process.on('message', this.onProcessMessage.bind(this));    
    }

    PipeToServer.prototype.onProcessMessage = function (message, handle) {

        if(message.data.hasOwnProperty('CREATE')) {
            this.channel = new Channel(this, message.data.options);

            message.data.options.playingFileName = "Quickstart-1425229312283.log";

            if(message.data.options.playingFileName) {
                var self = this;
                setTimeout(function() {
                    console.log(message.data.options.playingFileName)
                    self.play(message.data.options.playingFileName);
                }, 2000);
            }
            
            if(Settings.CHANNEL_RECORD_SESSION) {
                this.recordingFileName = Settings.CHANNEL_RECORDING_PATH + this.channel.name + "-" + Date.now() + ".log";
                if(!fs.existsSync(Settings.CHANNEL_RECORDING_PATH)) {
                    fs.mkdirSync(Settings.CHANNEL_RECORDING_PATH);
                }
            }

        } else if (message.data.hasOwnProperty('KILL')) {
            this.channel.destroy();
        } else {
            this.onMessage(message);

            if(Settings.CHANNEL_RECORD_SESSION && this.channel && this.channel.name) {
                var m = JSON.stringify(message);
                var timestamp = Date.now();
                var line = timestamp + m + "\n";

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
        }

        this.process.send(message);
    };

    PipeToServer.prototype.onMessage = function (message) {
        switch(message.recipient) {
            case 'channel':
                Nc.trigger(Nc.ns.channel.events.controlCommand.channel, message);    
                break;
            default: 
                Nc.trigger(Nc.ns.channel.events.controlCommand.user + message.recipient, message);    
                break;
        }
        
    }

    PipeToServer.prototype.play = function(playingFileName) {
        var self = this;
        var data = fs.readFileSync(Settings.CHANNEL_RECORDING_PATH + playingFileName);    
        var lines = data.toString().split("\n");
        var now = Date.now();
        var start = 0;
        for (var i = 0; i < lines.length; i++) {
            // bind message variable
            (function() {
                var line = lines[i];
                if(line.length > 0) {
                    var time = parseInt(line.substring(0, Date.now().toString().length), 10);
                    if(i == 0) {
                        start = time;
                    }
                    time -= start;

                    var jsonString = line.substring(Date.now().toString().length);
                    var message = JSON.parse(jsonString);

                    setTimeout(function() {
                        console.log(" ");
                        console.log(util.inspect(message, { showHidden: true, depth: 4 }));
                        self.onProcessMessage(message, null);
                    }, time);                
                }
            })();
        };
    };

    PipeToServer.prototype.destroy = function() {
        this.send('coordinator', {destroy:this.channel.name});
        this.process.exit(0);
    };

    return PipeToServer;

});