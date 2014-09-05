'use strict';
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        
        watch: {
            html: {
              files: ['{,*/}*.{js,html}'],
              tasks: [],
              options: {
                livereload: true,
              },
            },
            sass: {
                files: ['{,*/}*.{scss,sass}'],
                tasks: ['sass'],
                options: {
                  livereload: true,
                },
            }
        },

        sass: {
          dist: {
            options: {
              style: 'expanded'
            },
            files: {
              'sudoku.css': 'sudoku.scss',
            }
          }
        },

        connect: {
          server: {
            options: {
              port: 8000,
              hostname: '*',
            }
          }
        }

    });

    grunt.registerTask('build', ['sass']);
    grunt.registerTask('default', [
        'build',
        'connect:server',
        'watch'
    ]);
};
