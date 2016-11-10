module.exports = function(grunt) {

grunt.initConfig({
	jshint: {
		all: [
			'src/slider/utils.js',
			'src/slider/core.js'
		]
	},
	concat: {
		dist: {
			src: [
				'src/slider/start.js',
				'src/slider/utils.js',
				'src/slider/core.js',
				'src/slider/objects.js',
				'src/slider/end.js'
			],
			dest: 'dist/slider.js',
		},
	},
	uglify: {
		options: {
			compress: {
				drop_console: true
			}
		},
		my_target: {
			files: {
				'dist/slider.min.js': ['dist/slider.js']
			}
		}
	},
	watch: {
		scripts: {
			files: 'src/**/*.js',
			tasks: ['dev']
		},
	}
});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint','concat','uglify']);
  grunt.registerTask('dev', ['concat']);

};
