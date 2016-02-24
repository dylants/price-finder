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
    jasmine_nodejs: {
      options: {
        specNameSuffix: 'test.js',
        reporters: {
          console: {
            colors: true,
            cleanStack: true,
            verbosity: true,
            listStyle: 'indent',
            activity: false,
          },
        },
      },
      unit: {
        specs: ['test/unit/**'],
      },
      e2e: {
        specs: ['test/e2e/**'],
      },
    },
  });

  // load all the grunt tasks at once
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['eslint', 'jasmine_nodejs:unit']);
  grunt.registerTask('e2e', ['env:e2e', 'jasmine_nodejs:e2e']);
};
