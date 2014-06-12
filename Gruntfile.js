module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner:
            '/*!\n'+
            ' * Bootstrap-Confirmation.js <%= pkg.version %>\n'+
            ' * https://github.com/mistic100/Bootstrap-Confirmation\n'+
            ' * Copyright 2013 Nimit Suwannagate <ethaizone@hotmail.com>\n'+
            ' * Copyright <%= grunt.template.today("yyyy") %> Damien "Mistic" Sorel <http://www.strangeplanet.fr>\n'+
            ' * Licensed under the Apache License, Version 2.0 (the "License")\n'+
            ' */',

        // compress js
        uglify: {
            options: {
                banner: '<%= banner %>\n'
            },
            dist: {
                files: {
                    'bootstrap-confirmation.min.js': [
                        'bootstrap-confirmation.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'uglify'
    ]);
};