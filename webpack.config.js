////commented it out because grunt and browserify is doing this already
const path = require('path');

module.exports = {
	 entry: './app/resources/js/vue.js',
	 output: {
	     path: path.resolve('./app/public', 'js'),
	     filename: 'new_vue.js'
	 },
	module: {
     rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
 }; 
