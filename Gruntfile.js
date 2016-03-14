'use strict';

module.exports = function exports(grunt) {
  grunt.initConfig({
    eslint: {
      files: [
        '**/*.js',
      ],
      options: {
        quiet: true,
      },
    },
    env: {
      e2e: {
        DEBUG: 'price-finder*',
      },
    },
    mochaTest: {
      unit: {
        src: ['test/unit/**/*test.js'],
      },
      e2e: {
        options: {
          reporter: 'list',

          // set the timeout for each test to 60 seconds (crazy! but necessary it seems)
          timeout: 60000,
        },
        src: ['test/e2e/**/*test.js'],
      },
    },
  });

  // load all the grunt tasks at once
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['eslint', 'mochaTest:unit']);
  grunt.registerTask('e2e', ['env:e2e', 'mochaTest:e2e']);
};
