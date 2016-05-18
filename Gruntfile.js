module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-wiredep');

	grunt.initConfig({
		wiredep: {
			target: {
				src: 'dist/index.html' // point to your HTML file.
		  	}
		},
		watch: {
		  files: ['bower_components/*'],
		  tasks: ['wiredep']
		}
	});

	grunt.registerTask('default', ['wiredep', 'watch']);
};