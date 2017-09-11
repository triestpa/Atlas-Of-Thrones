const path = require('path')
const BabiliPlugin = require('babili-webpack-plugin')

// Babel loader for Transpiling ES8 Javascript for browser usage
const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  include: [path.resolve(__dirname, '../app')],
  query: { presets: ['es2017'] }
}

// SCSS loader for transpiling SCSS files to CSS
const scssLoader = {
  test: /\.scss$/,
  loader: 'style-loader!css-loader!sass-loader'
}

// URL loader to resolve data-urls at build time
const urlLoader = {
  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
  loader: 'url-loader?limit=100000'
}

// HTML load to allow us to import HTML templates into our JS files
const htmlLoader = {
  test: /\.html$/,
  loader: 'html-loader'
}

const webpackConfig = {
  entry: './app/main.js', // Start at app/main.js
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js' // Output to public/bundle.js
  },
  module: { loaders: [ babelLoader, scssLoader, urlLoader, htmlLoader ] }
}

if (process.env.NODE_ENV === 'production') {
  // Minify for production build
  webpackConfig.plugins = [ new BabiliPlugin({}) ]
} else {
  // Generate sourcemaps for dev build
  webpackConfig.devtool = 'eval-source-map'
}

module.exports = webpackConfig
