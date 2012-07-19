function Factory() {
    this.notificationCenter = new NotificationCenter();
}

Factory.prototype.new = function () {
    
    if (arguments.length < 1)
        throw 'Too fiew arguments';
    if (typeof arguments[0] != 'function')
        throw arguments[0] + ' is not a function';
    
    var klass = arguments[0];
    klass.prototype = new ChuckObject(this.notificationCenter, this);
    return new (klass.bind.apply(klass,arguments))();
}

function ChuckObject(notificationCenter, factory) {
    this.notificationCenter = notificationCenter;
    this.factory = factory;
}

function Player(name) {
    this.name = name;
    console.log("Created Player");
    console.log("Player.notificationCenter " + this.notificationCenter);
}

function NotificationCenter() {
    console.log("Created NotificationCenter");
}

var factory = new Factory();

var player = factory.new(Player, "jeena");
console.log("Player.name " + player.name);


/*

Lala:chuck.js jeena$ node Factory.js 
Created NotificationCenter
Created Player
Player.notificationCenter [object Object]
Player.name jeena

*/