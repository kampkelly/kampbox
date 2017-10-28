module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			files: ["app/*.js", "app/resources/js/*.js", "app/routes/*.js", "app/config/*.js", "app/controllers/*.js", "app/models/*.js"],
			options: {
				esnext: true,
				globals: {
					jQuery: true
				}
			}
		},
		sass: {
			production: {
				files: {
					"app/public/css/style1.css": ["app/resources/scss/style1.scss"],
					"app/public/css/style2.css": ["app/resources/scss/style2.scss"]
				}
			}
		},
		autoprefixer: {
			single_file: {
				src: "app/public/css/style.css",
				dest: "app/public/css/style.css"
			}
		},
		browserify: {
			client: {
				src: ["app/resources/js/main.js"],
				dest: "app/public/js/bundle.js"
			},
			myscripts: {
				src: ["app/resources/js/scripts.js"],
				dest: "app/public/js/myscripts.js"
			},
			options: {
				transform: ['vueify']
			},
			dist: {
				src: ["app/resources/js/vue.js"],
				dest: "app/public/js/vue.js"
			}
		},
		watch: {
			css: {
				files: ["app/resources/scss/*.scss"],
				tasks: ["css"]
			},
			scripts: {
				files: ["app/resources/js/*.js",  "app/routes/*.js", "app/*.js", "app/controllers/*.js", "app/models/*.js", 
				"app/config/*.js", "app/resources/js/vue.js", "app/resources/js/vue_views/*.vue", "app/resources/js/vue_views/**/*.vue"],
				tasks: ["jshint", "browserify"]
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("css", ["sass", "autoprefixer"]);
	grunt.registerTask("js", ["browserify"]);
	grunt.registerTask("default", ["jshint", "css", "js"]);

};