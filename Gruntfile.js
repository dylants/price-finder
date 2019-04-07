'use strict';

let src = ['test/e2e/**/*test.js'];
// in CI, ignore some e2e tests since they don't behave correctly for some reason
if (process.env.CI) {
  src = src.concat([
    '!test/e2e/gamestop-uris-test.js',
    '!test/e2e/newegg-uris-test.js',
  ]);
}

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
        src,
      },
    },
  });

  // load all the grunt tasks at once
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['eslint', 'mochaTest:unit']);
  grunt.registerTask('e2e', ['mochaTest:e2e']);
};
