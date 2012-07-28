define([
],

function () {

    function NotificationCenter() {
        this.topics = {};
        this.subUid = -1;
    }

    NotificationCenter.prototype.trigger = function (topic) {

        if (!this.topics[topic]) {
            throw "No such topic " + topic + ". Could not trigger.";
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