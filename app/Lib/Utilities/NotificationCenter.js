define([
    "Lib/Utilities/Exception"
],

function (Exception) {

	"use strict";

    function populate(obj, path) {
        path = path || "nc.ns";
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

        this.ns = {
            client: {
                pointerLock: {
                    request: null,
                    change: null
                },
                view: {
                    layer: {
                        createAndInsert: null,
                        levelSizeUpdate: null
                    },
                    mesh: {
                        create: null,
                        add: null,
                        remove: null,
                        update: null,
                        addFilter: null,
                        removeFilter: null,
                        swapMeshIndexes: null,
                        swapMeshes: null
                    },
                    animatedMesh: {
                        create: null
                    },
                    healthBar: {
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
                    display: {
                        change: null
                    },
                    debugMode: {
                        toggle: null
                    },
                    gameStats: {
                        toggle: null,
                        kill: null,
                        update: null
                    },
                    swiper: {
                        swipe: null,
                        end: null
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
                    events: {
                        render: null,
                        destroy: null
                    },
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
                    worldUpdateObjects: {
                        add: null,
                        remove: null,
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
                            killed: null,
                            clearFingerPrints: null
                        },

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
        if (topic === undefined) {
            throw new Exception("Topic not registered in nc. See stack trace.");
        }

        if (typeof topic === 'object') {
            throw new Exception("Topic bad format " + JSON.stringify(topic));
        }

        if (topic.indexOf("nc.ns") !== 0) {
             throw new Exception("Topic bad format, does not begin with nc.ns. : " + topic);
        }
    };

    NotificationCenter.prototype.trigger = function (topic /*, arguments*/) {

        this.validate(topic);

        if (!this.topics[topic]) {
            //console.warn("No such topic " + topic + ". Could not trigger. arguments: " + arguments.join);
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

        if(token && token.constructor === Array) {
            this.offAll(token);
            return;
        }

        for(var m in this.topics) {
            if (this.topics[m]) {
                for(var i = 0, j = this.topics[m].length; i < j; i++) {
                    if (this.topics[m][i].token === token) {
                        this.topics[m].splice(i, 1);
                        return;
                    }
                }
            }
        }
    }

    // should be treated as a private function - use nc.off(Array);
    NotificationCenter.prototype.offAll = function (tokens) {
        for (var i = 0; i < tokens.length; i++) {
            this.off(tokens[i]);
        };
    }


    return new NotificationCenter(); // making it singleton
});