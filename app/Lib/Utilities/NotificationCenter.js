define([
],

function () {

    function NotificationCenter () {
        this.topics = {};
        this.subUid = -1;
/*
        var i = 0;
        this.nc = {
            client: {
                view: {
                    mesh: {
                        create: i++,
                        add: i++,
                        remove: i++,
                        update: i++
                    },
                    playerInfo: {
                        createAndAdd: i++,
                        remove: i++,
                        update: i++
                    },
                    preloadBar: {
                        update: i++
                    },
                    fullScreen: {
                        change: i++
                    },
                    debugMode: {
                        toggle: i++
                    },
                    gameInfo: {
                        toggle: i++
                    }
                    events: {
                        ready: i++
                    }
                },
                input: {
                    handAction: {
                        request: i++
                    },
                    xy: {
                        change: i++
                    }
                },
                server: {
                    gameCommand: {
                        send: i++
                    }
                }
            },
            core: {
                game: {
                    gameObject: {
                        add: i++,
                        remove: i++
                    }
                    events: {
                        level: {
                            loaded: i++
                        }
                    }
                }
            },
            channel: {
                pipeToServer: function(v) { return v + "-ns.channel.pipeToServer")}
            }

        };
        */
    }

    NotificationCenter.prototype.trigger = function (topic /*, arguments*/) {

        if (!this.topics[topic]) {
            console.warn("No such topic " + topic + ". Could not trigger. arguments: " + arguments.join);
        }

        var args = Array.prototype.slice.call(arguments, 1);
        var subscribers = this.topics[topic];
        var len = subscribers ? subscribers.length : 0;

        while (len--) {
            var subscriber = subscribers[len];
            subscriber.func.apply(subscriber.context, args);
        }
    }

    NotificationCenter.prototype.on = function (topic, func, context) {
        
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }

        var token = ( ++this.subUid ).toString();
        this.topics[topic].push({
            token: token,
            func: func,
            context: context
        });

        return token;
    }

    NotificationCenter.prototype.off = function (token) {

        for(var m in this.topics) {
            if (this.topics[m]) {
                for(var i = 0, j = this.topics[m].length; i < j; i++) {
                    if (this.topics[m][i].token === token) {
                        this.topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
    }

    return new NotificationCenter(); // making it singletone
});