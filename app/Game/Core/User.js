define([
],
 
function () {

    function User (id, options) {
        this.id = id;
        this.options = options;
        
        this.options.id = this.id;
        if(!this.options.nickname) {
        	this.options.nickname = this.id;
        }
    }

    return User;
});