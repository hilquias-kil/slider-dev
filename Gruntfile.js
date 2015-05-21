module.exports = function(grunt) {

grunt.initConfig({
  requirejs: {
    compile: {
      options: {
        baseUrl: "js/",
        mainConfigFile:"js/config.js",
        name: 'slider-main',
        optimize: 'none',
        out: "js-min/main-min.js"
      }
    }
  },
  jshint: {
    all: ["js/**/*.js"]
  }
});

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint','requirejs']);

};
