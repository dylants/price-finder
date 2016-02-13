'use strict';

const debugCaller = require('debug-caller');

module.exports = function exports() {
  // set a depth of 2 to avoid using this file within debug statements
  // (since this is just a passthrough for logging)
  return debugCaller('price-finder', {
    depth: 2,
  });
};
