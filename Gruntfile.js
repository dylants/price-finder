"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            files: [
                "**/*.js"
            ],
            options: {
                ignores: [
                    "node_modules/**"
                ],
                jshintrc: true
            }
        },
        jasmine_nodejs: {
            options: {
                specNameSuffix: "test.js",
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: true,
                        verbosity: true,
                        listStyle: "indent",
                        activity: false
                    }
                }
            },
            all: {
                specs: ["test/unit/**"]
            }
        }
    });

    // load all the grunt tasks at once
    require("load-grunt-tasks")(grunt);

    grunt.registerTask("test", ["jshint", "jasmine_nodejs"]);
};
