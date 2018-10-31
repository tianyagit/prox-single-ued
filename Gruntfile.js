module.exports = function(grunt) {
	var targetDir = 'dist/';
	var productDir = 'prox/web/resource/';
	var rootPaths = ['C:/code/we7/']; 
	var fs = require('fs');
	for (path in rootPaths) {
		if (fs.existsSync(rootPaths[path])) {
			productDir = rootPaths[path] + productDir;
			break;
		}
	}
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		we7_html2js : {
			options : {
				htmlmin : {
					collapseWhitespace: true,
					collapseBooleanAttributes: true
				},
				indexRename : function(filepath) {
					return filepath.replace('_src/template/', '').replace('_src/components/', '').replace(/\//g, '-');
				},
				globalname: 'window.util.templates',
			},
			emoji : {
				src : '_src/components/emoji/content*.tpl',
				dest : targetDir + 'components/emoji/emoji.js',
			},
			fontawesome : {
				src : '_src/components/fontawesome/content*.tpl',
				dest : targetDir + 'components/fontawesome/fontawesome.js',
			},
			main : {
				src : '_src/template/*.html',
				dest : targetDir + 'template.js',
			}
		},
		//处理angularjs模板
		ngtemplates : {
			options : {
				module : 'we7app',
				url: function(url) { return url.replace(/_src\/module\/([a-zA-Z_-]+)\/template\//, '$1-').replace(/_src\/module\/([a-zA-Z_-]+)\/widget\//, 'widget-').replace(/_src\/(module\/([a-zA-Z_-]+)|common)\/directive\//, 'directive-').replace(/\//g, '-').replace(/_src\-independent_module\-.+\-directive\-/, 'directive-'); },
				htmlmin : {
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeComments: true 	// 取消注释，项目中也不允许使用注释指令
				}
			},
			main : {
				src : ['_src/common/**/*.html', '_src/module/**/*.html', '_src/independent_module/**/*.html'],
				dest : targetDir + 'ngtemplate.js',
			}
		},
		ngmin: {
			module : {
				expand: true,
				cwd: '_src/module',
				src: ['**/*.js'],
				dest: 'dist/module'
			},
			independent_module : {
				expand: true,
				cwd: '_src/independent_module',
				src: ['**/*.js'],
				dest: 'dist/independent_module'
			},
			common : {
				expand: true,
				cwd: '_src/common',
				src: ['**/*.js'],
				dest: 'dist/common'
			},
			app : {
				src: ['_src/app.js'],
				dest: 'dist/app.js'
			}
		},
		concat: {
			options: {
				separator: '\n',
			},
			application : {
				options : {
					banner: '(function(window) {\nvar util = {};\n',
					footer: 
					'\nif (typeof define === "function" && define.amd) {'+
					'\n	define(function(){'+
					'\n		return util;'+
					'\n	});'+
					'\n} else {'+
					'\n	window.util = util;'+
					'\n}'+
					'\n})(window);'
				},
				src: ['_src/application/*.js'],
				dest: targetDir + 'application.js',
			},
			applicationhtml : {
				options: {
					separator: '\n',
				},
				src: [targetDir + 'application.js', '<%= we7_html2js.main.dest %>'],
				dest: targetDir + 'application.all.js',
			},
			angular : {
				options: {
					separator: '\n',
				},
				src: [	'_src/library/angular.js', '_src/library/angular-*.js',
						'dist/app.js', 'dist/common/**/*.js',
						'<%= ngtemplates.main.dest %>',
						'dist/module/wapeditor/*.js', 'dist/module/wapeditor/**/*.js', 
						'dist/module/**/*.js'],
				dest: targetDir + 'ngapp.js',
			},
			common : {
				src: ['<%= concat.angular.dest %>'],
				dest: targetDir + 'common.js',
			},
			requirejs : {
				options: {
					separator: '\n',
				},
				src: ['_src/require.js', '_src/config.js'],
				dest: targetDir + 'require.js',
			},
			special: {
				src: ['dist/independent_module/app.js', 'dist/independent_module/**/*.js'],
				dest: targetDir + 'special.js',
			},
		},
		//压缩JS文件
		uglify: {
			options: {
				banner: ''
			},
			common : {
				files: {
					'dist/common.min.js' : ['<%= concat.common.dest %>'],
					'dist/config.js' : ['_src/config.js']
				}
			},
			components : {
				files: [{
					expand: true,
					src: ['components/fileuploader/*.js','components/webuploader/*.js'],
					dest: 'dist',
					cwd: 'dist/'
				}]
			},
			lib : {
				files: [{
					expand: true,
					src: ['library/**/*.js', '!library/**/*.min.js'],
					dest: 'dist',
					cwd: 'dist/'
				}]
			},
			angular : {
				files: [{
					expand: true,
					src: ['library/angular.js', 'library/angular-sanitize.js'],
					dest: 'dist',
					ext: '.min.js',
					cwd: 'dist/'
				}]
			},
			application : {
				files: {
					'dist/application.min.js' : ['<%= concat.applicationhtml.dest %>']
				}
			},
			special: {
				src: ['dist/special.js'],
				dest: 'dist/special.min.js'
			},

			//耗时任务 
			job : {
				src: ['_src/job.js'],
				dest: '../../prox/web/resource/js/app/job.js',
			},
			
		},
		cssmin: {
			options: {
				banner: '',
				keepSpecialComments: '*',
				sourceMap: false
			},
			components : {
				files: [{
					expand: true, 
					cwd: '_src', 
					src: 'components/**/*.css',
					dest: 'dist', 
				}]
			}
		},
		copy : {
			common : {
				src: 'dist/common.min.js', 
				dest: '../../prox/web/resource/js/app/common.min.js'
			},
			debug : {
				src: 'dist/common.js', 
				dest: '../../prox/web/resource/js/app/common.js'
			},
			develop_components : {
				files: [{
					expand: true,
					src: ['components/**/*.*', '!components/**/*.tpl'],
					dest: 'dist',
					cwd: '_src/'
				}]
			},
			develop_common : {
				files: {
					'dist/common.min.js' : ['<%= concat.common.dest %>']
				}
			},
			develop_util : {
				files: {
					'dist/application.min.js' : ['<%= concat.applicationhtml.dest %>']
				}
			},
			develop_lib : {
				files: [{
					expand: true,
					src: ['library/*.js'],
					dest: 'dist',
					cwd: '_src/'
				}]
			},
			components : {
				files: [{
					expand: true, 
					cwd: 'dist/components', 
					src: ['**/*.*'], 
					dest: '../../prox/web/resource/components/'
				}]
			},
			lib : {
				files: [{
					expand: true, 
					cwd: 'dist/library', 
					src: ['**/*.*', '!angular.js', '!angular-sanitize.js'], 
					dest: '../../prox/web/resource/js/lib/'
				}]
			},
			util : {
				src: 'dist/application.min.js', 
				dest: '../../prox/web/resource/js/app/util.js'
			},
			requirejs : {
				src: 'dist/require.js',
				dest: '../../prox/web/resource//js/require.js'
			},
			emoji : {
				src: '_src/components/emoji/emotions.css',
				dest: 'dist/components/emoji/emotions.css'
			},
			//耗时任务 
			job : {
				src: ['_src/job.js'],
				dest: '../../prox/web/resource/js/app/job.js',
			},
			dev : {
				files: [
					{
						expand: true,
						cwd: '_src/module',
						src: ['**/*.js'],
						dest: 'dist/module'
					},
					{
						expand: true,
						cwd: '_src/independent_module',
						src: ['**/*.js'],
						dest: 'dist/independent_module'
					},
					{
						expand: true,
						cwd: '_src/common',
						src: ['**/*.js'],
						dest: 'dist/common'
					},
					{
						src: ['_src/app.js'],
						dest: 'dist/app.js'
					}
				]
			}
		},
		//清理目录
		clean : {
			options: {
				force: true
			},
			build: [targetDir + '/**'],
			product : ['../../prox/web/resource/components/', '../../prox/web/resource/js/app/', '../../prox/web/resource/js/lib/']
		},
		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
					grunt.log.writeln('Waiting for more changes...');
				},
			},
			master : {
				files: '_src/**',
				tasks: ['master'],
			},

			scripts : {
				files: '_src/**',
				tasks: ['product'],
			},
			debug : {
				files: '_src/**',
				tasks: ['develop'],
			}
		}
		
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-we7-html2js');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-ngmin');



	grunt.registerTask('master', ['clean:build', 'we7_html2js:main', 'ngtemplates', 'ngmin', 'concat', 'uglify', 'copy:common', 'watch:master']);

	grunt.registerTask('product', ['clean:product', 'clean:build', 'we7_html2js', 'ngtemplates', 'ngmin', 'concat', 'copy:develop_components', 'copy:develop_lib', 'uglify', 'cssmin', 'copy:common', 'copy:components', 'copy:util', 'copy:lib', 'copy:requirejs', 'watch:scripts']);
	
	grunt.registerTask('develop', ['clean:product', 'clean:build', 'we7_html2js', 'copy:emoji', 'ngtemplates', 'copy:dev', 'concat', 'copy:develop_components', 'copy:develop_common', 'copy:develop_lib', 'copy:develop_util', 'cssmin', 'copy:common', 'copy:components', 'copy:util', 'copy:lib', 'copy:requirejs', 'watch:debug']);
	
	grunt.registerTask('test', function(){
		var fs = require('fs');
		//console.dir(grunt.config.get('pkg'));
		for (path in rootPaths) {
			if (fs.existsSync(rootPaths[path])) {
				productDir = rootPaths[path] + productDir;
				break;
			}
		}
	});
};