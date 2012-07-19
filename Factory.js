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
        factory: this,
        notificationCenter: this.notificationCenter
    });

    return new (module.bind.apply(module, arguments))();
}

function ExtensibleObject(properties) {
    for(var propertyName in properties) {
        this[propertyName] = properties[propertyName];
    }
}

function Player(name) {
    this.name = name;
}

function NotificationCenter() {
    this.foo = "a"
}

NotificationCenter.prototype.alert = function(a) {
    console.log(a)
}

var factory = new Factory();

var player = factory.new(Player, "jeena");

player.factory.new(Player, "logsol").notificationCenter.alert("foo");


/*

Lala:chuck.js jeena$ node Factory.js 
foo

*/