define([
],
 
function () {

	"use strict";
 
    function AudioPlayer(path) {
    	this.audio = new Audio(path);
    	this.audio.loop = true;
    	this.audio.volume = 0.1;

    	this.audio.addEventListener('timeupdate', function(){
			var buffer = 1
			if(this.currentTime > this.duration - buffer) {
				this.currentTime = 1
				this.play()
			}
		}, false);
    }
 
    AudioPlayer.prototype.play = function() {
        //this.audio.play();
        //this.doPlay = true;
    }

    AudioPlayer.prototype.stop = function() {
    	this.audio.stop();
    	this.doPlay = false;
    };

    AudioPlayer.prototype.destroy = function() {
    	this.stop();
    };
 
    return AudioPlayer;
 
});