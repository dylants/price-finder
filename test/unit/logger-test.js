"use strict";

var logger = require("../../lib/logger");

describe("The Logger", function() {
    it("should exist", function() {
        expect(logger).toBeDefined();
    });

    it("should have the log function", function() {
        expect(logger.log).toBeDefined();
    });

    it("should have the error function", function() {
        expect(logger.error).toBeDefined();
    });
});
