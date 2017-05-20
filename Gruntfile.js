module.exports = function(grunt) {

	var targetDirectory = 'build/';
	var sourceDirectory = 'source/';

	/*
		default tasks for all methods to use
	*/
	var tasks = [
		'clean',
		'concat',
		'copy',
		'sass:mhr',
		'jshint:mhr',
		'uglify',
		'cssmin:mhr'
	];

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',

		connect: {
			server: {
				options: {
					port: 8080,
					keepalive: true,
					base: {
						path: 'build',
						options: {
							index: 'index.html',
							maxAge: 300000
						}
					}
				}
			}
		},
		sass: {
			options: {
				debugInfo: false,
				trace: false
			},
			mhr: {
				files: {
					'build/css/mhr.css': [
						'build/sass/mhr.scss'
					]
				}
			}
		},
		cssmin: {
			mhr: {
				expand: true,
				cwd: 'build/css/',
				src: ['*.css'],
				dest: 'build/css/',
				ext: '.min.css'
			},
		},
		concat: {
			baseline: {
				src: [
					sourceDirectory + 'sass/mixins/*.scss',
					sourceDirectory + 'sass/baseline/common/*.scss',
					sourceDirectory + 'sass/baseline/modules/*.scss'
				],
				dest: targetDirectory + '/sass/baseline.scss',
			},
			tablet: {
				src: [
					sourceDirectory + 'sass/tablet/common/*.scss',
					sourceDirectory + 'sass/tablet/modules/*.scss'
				],
				dest: targetDirectory + '/sass/tablet.scss',
			},
			desktop: {
				src: [
					sourceDirectory + 'sass/desktop/common/*.scss',
					sourceDirectory + 'sass/desktop/modules/*.scss'
				],
				dest: targetDirectory + '/sass/desktop.scss',
			},
			desktopExtended: {
				src: [
					sourceDirectory + 'sass/desktop-extended/common/*.scss',
					sourceDirectory + 'sass/desktop-extended/modules/*.scss'
				],
				dest: targetDirectory + '/sass/desktop-extended.scss',
			},
			js: {
				src: [
					sourceDirectory + 'js/mhr.js',
					sourceDirectory + 'js/modules/*.js'
				],
				dest: targetDirectory + 'js/mhr.js'
			}
		},
		watch: {
			// js: {
				files: [
					'Gruntfile.js',
					sourceDirectory + 'js/**/*.js',
					sourceDirectory + 'sass/**/*.scss',
					sourceDirectory + 'index.html',
					sourceDirectory + 'i/**/*'
				],
				tasks: tasks
			// },
		},
		clean: [
			'build/*'
		],
		jshint: {
			options: {
				debug: true,
				bitwise: true,
				eqeqeq: true,
				passfail: false,
				nomen: false,
				plusplus: false,
				undef: true,
				evil: true,
				curly: true,
				eqnull: true,
				browser: true,
				globals: {
					module: true,
					define: true,
				}
			},
			mhr: [
				'Gruntfile.js',
				sourceDirectory + 'js/*.js',
				sourceDirectory + 'js/modules/*.js'
			],
		},
		uglify: {
			build: {
				files: {
					'build/js/mhr.min.js': 'build/js/mhr.js'
				}
			}
		},
		copy: {
			main: {
				files: [{
					cwd: sourceDirectory,
					expand: true,
					src: 'sass/mhr.scss',
					dest: targetDirectory
				}, {
					cwd: sourceDirectory,
					expand: true,
					src: 'fonts/*',
					dest: targetDirectory
				}, {
					cwd: sourceDirectory,
					expand: true,
					src: 'index.html',
					dest: targetDirectory
				}, {
					cwd: sourceDirectory,
					expand: true,
					src: 'i/**/*',
					dest: targetDirectory
				}]
			}
		}
	});

	grunt.registerTask('watch', [
		'watch:mhr'
	]);

	grunt.registerTask('default', tasks);

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	//grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');

};
