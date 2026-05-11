define([
],

function () {

    "use strict";

    var MAX_BUFFER_SIZE = 300;

    function InputBuffer() {
        this._buffer = [];
    }

    InputBuffer.prototype.add = function(entry) {
        this._buffer.push(entry);
        if (this._buffer.length > MAX_BUFFER_SIZE) {
            this._buffer.shift();
        }
    };

    InputBuffer.prototype.acknowledgeUpTo = function(seq) {
        while (this._buffer.length > 0 && this._buffer[0].seq <= seq) {
            this._buffer.shift();
        }
    };

    InputBuffer.prototype.getUnacknowledged = function() {
        return this._buffer;
    };

    InputBuffer.prototype.clear = function() {
        this._buffer = [];
    };

    return InputBuffer;

});
