
var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './_src/componentx/resource/index.js', 
	output: {
		path: path.resolve(__dirname, 'dist'),
		// path : path.resolve(__dirname, '../../pros/web/resource/'),
		libraryTarget: 'amd',
		filename: 'components/fileuploader/fileuploader.min.js',
	},
	amd: {
		jQuery: true
	},
	// watch : true,
	module: {
		rules: [
			{ 
				test:/\.html$/,
				loader:'html-loader'
			},
			{ 
				test:/\.css$/,
				loader:'css-loader'
			}
		]
	},
	plugins : [
		// new webpack.ProvidePlugin({
		// 	angular : 'angular'
		// })
	]
};