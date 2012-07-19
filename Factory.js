function Factory() {
    this.notificationCenter = new NotificationCenter();
}

Factory.prototype.new = function (constructor /*, arg1, arg2, ... */) {
    
    if (arguments.length < 1)
        throw 'Too fiew arguments';
    if (typeof arguments[0] != 'function')
        throw arguments[0] + ' is not a function';
    
    var instance = Object.create(constructor.prototype, {
        notificationCenter: {
             value: this.notificationCenter
        },
        factory: {
            value: this
        }
    });
    
    constructor.apply(instance, Array.prototype.slice.call(arguments, [1]));
    return instance; 
}

function Player(name) {
    this.name = name;
    this.notificationCenter.log("Player " + name + " created")
}

function NotificationCenter() {
    this.foo = "a"
}

NotificationCenter.prototype.log = function(a) {
    console.log(a)
}

var factory = new Factory();

var player = factory.new(Player, "jeena");

player.factory.new(Player, "logsol").notificationCenter.log("test");


/*

Lala:chuck.js jeena$ node Factory.js 
foo

*/