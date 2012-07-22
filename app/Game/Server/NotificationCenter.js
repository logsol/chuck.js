define(function() {

	function NotificationCenter() {
        this.topics = {};
        this.subUid = -1;
	}

    NotificationCenter.prototype.trigger = function(topic, args) {
        if (!this.topics[topic]) {
            throw "No such topic " + topic + ". Could not trigger.";
        }

        var subscribers = this.topics[topic];
        var len = subscribers ? subscribers.length : 0;

        while (len--) {
            subscribers[len].func(topic, args);
        }

        return this;
    }

    NotificationCenter.prototype.on = function(topic, func) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }

        var token = ( ++this.subUid ).toString();
        this.topics[topic].push({
            token: token,
            func: func
        });

        return token;
    }

    NotificationCenter.prototype.off = function(token) {

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
        return this;
    }

	return NotificationCenter;
});