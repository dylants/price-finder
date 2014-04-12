"use strict";

// TODO allow this to be configurable
var DEBUG = true;

function log(message) {
    if (DEBUG) {
        console.log(message);
    }
}

function error(message) {
    if (DEBUG) {
        console.error(message);
    }
}

module.exports.log = log;
module.exports.error = error;
