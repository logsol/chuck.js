define([
    "Lib/Utilities/Exception"
],

function (Exception) {

    function populate(obj, path) {
        path = path || "Nc.ns";
        for(var key in obj) {
            if(!obj.hasOwnProperty(key)) continue;
            if(obj[key] === null) {
                obj[key] = path + "." + key;
            } else {
                obj[key] = populate(obj[key], path + "." + key);
            }
        }
        return obj;
    }

    function NotificationCenter () {
        this.topics = {};
        this.subUid = -1;

        var i = 0;
        this.ns = {
            client: {
                view: {
                    mesh: {
                        create: null,
                        add: null,
                        remove: null,
                        update: null,
                        addFilter: null,
                        removeFilter: null
                    },
                    animatedMesh: {
                        create: null
                    },
                    playerInfo: {
                        createAndAdd: null,
                        remove: null,
                        update: null
                    },
                    playerArrow: {
                        createAndAdd: null,
                        update: null
                    },
                    preloadBar: {
                        update: null
                    },
                    fullscreen: {
                        change: null
                    },
                    debugMode: {
                        toggle: null
                    },
                    events: {
                        ready: null
                    },
                    gameStats: {
                        toggle: null
                    }
                },
                input: {
                    handAction: {
                        request: null
                    },
                    xy: {
                        change: null
                    }
                },
                game: {
                    gameStats: {
                        toggle: null
                    },
                    zoomIn: null,
                    zoomOut: null,
                    zoomReset: null
                },
                to: {
                    server: {
                        gameCommand: {
                            send: null
                        }
                    }
                }
            },
            core: {
                game: {
                    gameObject: {
                        add: null,
                        remove: null
                    },
                    events: {
                        level: {
                            loaded: null
                        }
                    }
                }
            },
            channel: {
                events: {
                    controlCommand: {
                        channel: null,
                        user: null
                    },
                    user: {
                        joined: null,
                        left: null,
                        client: {
                            ready: null
                        },
                        level: {
                            reset: null
                        }
                    },
                    round: {
                        end: null
                    },
                    game: {
                        player: {
                            killed: null
                        }
                    }
                },
                engine: {
                    worldQueue: {
                        add: null
                    }
                },
                to: {
                    server: {
                        controlCommand: {
                            send: null
                        }
                    },
                    client: {
                        user: {
                            gameCommand: {
                                send: null
                            },
                            controlCommand: {
                                joinSuccess: null
                            }
                        },
                        gameCommand: {
                            broadcast: null
                        },
                        controlCommand: {
                            broadcast: null
                        }
                    }
                }
            },
            server: {
                events: {
                    controlCommand: {
                        coordinator: null,
                        user: null
                    },
                    user: {
                        joined: null,
                        left: null
                    }
                },
                to: {
                    client: {
                        message: {
                            send: null
                        }
                    }
                }
            }
        };

        populate(this.ns);
        
    }


    NotificationCenter.prototype.validate = function(topic) {
        if (typeof topic === 'object') {
            throw new Exception("Topic bad format " + JSON.stringify(topic));
        }

        if (topic.indexOf("Nc.ns") !== 0) {
             throw new Exception("Topic bad format, does not begin with Nc.ns. : " + topic);
        }
    };

    NotificationCenter.prototype.trigger = function (topic /*, arguments*/) {

        this.validate(topic);

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
        
        this.validate(topic);

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

    NotificationCenter.prototype.offAll = function (tokens) {
        for (var i = 0; i < tokens.length; i++) {
            this.off(tokens[i]);
        };
    }


    return new NotificationCenter(); // making it singleton
});