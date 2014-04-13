"use strict";

/**
 * A simple logger used to manage all log messages for the module.
 * Restricts output to only occur when DEBUG is enabled
 */
function Logger() {
    // default debugging to false
    this.DEBUG = false;

    this.log = function(message) {
        if (this.DEBUG) {
            console.log(message);
        }
    };

    this.error = function(message) {
        if (this.DEBUG) {
            console.error(message);
        }
    };
}

// single instance of the logger for all consumers
var logger = new Logger();

module.exports = logger;
