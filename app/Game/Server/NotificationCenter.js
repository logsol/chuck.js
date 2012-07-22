define(

    var NotificationCenter = {
        topics: {},
        subUid: -1
    };

    NotificationCenter.trigger = function(topic, args) {
        if (!NotificationCenter.topics[topic]) {
            throw "No such topic " + topic + ". Could not trigger.";
        }

        var subscribers = NotificationCenter.topics[topic];
        var len = subscribers ? subscribers.length : 0;

        while (len--) {
            subscribers[len].func(topic, args);
        }
    }

    NotificationCenter.on = function(topic, func) {
        if (!NotificationCenter.topics[topic]) {
            NotificationCenter.topics[topic] = [];
        }

        var token = ( ++NotificationCenter.subUid ).toString();
        NotificationCenter.topics[topic].push({
            token: token,
            func: func
        });

        return token;
    }

    NotificationCenter.off = function(token) {

        for(var m in NotificationCenter.topics) {
            if (NotificationCenter.topics[m]) {
                for(var i = 0, j = NotificationCenter.topics[m].length; i < j; i++) {
                    if (NotificationCenter.topics[m][i].token === token) {
                        NotificationCenter.topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
    }

	return NotificationCenter;
});