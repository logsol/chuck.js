function Factory() {
    this.notificationCenter = new NotificationCenter();
}

Factory.prototype.new = function () {
    
    if (arguments.length < 1)
        throw 'Too fiew arguments';
    if (typeof arguments[0] != 'function')
        throw arguments[0] + ' is not a function';
    
    var module = arguments[0];
    module.prototype = new ExtensibleObject({
        notificationCenter: this.notificationCenter,
        factory: this
    });

    return new (module.bind.apply(module, arguments))();
}

function ExtensibleObject(properties) {
    for(var propertyName in properties) {
        this.__defineGetter__(propertyName, function() {
            return properties[propertyName]
        });

        this.__defineSetter__(propertyName, function(val) {
            properties[propertyName] = val;
        });
    }
}

function Player(name) {
    this.name = name;
    console.log("Created Player: " + name);
    console.log("Player.notificationCenter " + this.notificationCenter);
}

function NotificationCenter() {
    console.log("Created NotificationCenter");
}

NotificationCenter.prototype.alert = function(a) {
    console.log(a)
}

var factory = new Factory();

var player = factory.new(Player, "jeena");
console.log("Player.name " + player.name);
console.log("New player name: " + player.factory.new(Player, "logsol").notificationCenter.alert);


/*

Lala:chuck.js jeena$ node Factory.js 
Created NotificationCenter
Created Player
Player.notificationCenter [object Object]
Player.name jeena

*/