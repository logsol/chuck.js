define([
],

function () {

	"use strict";

    var Parser = {};

    Parser.encode = function (message) {
        return JSON.stringify(message);
    }

    Parser.decode = function (message) {
        return JSON.parse(message);
    }

    return Parser;
});