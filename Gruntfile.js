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
      all: {
        specs: ['test/unit/**'],
      },
    },
  });

  // load all the grunt tasks at once
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['eslint', 'jasmine_nodejs']);
};
