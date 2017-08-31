const path = require('path')
const BabiliPlugin = require('babili-webpack-plugin')

const babelLoader = {
  test: /\.js$/,
  loader: 'babel-loader',
  include: [path.resolve(__dirname, '../app')],
  query: { presets: ['es2017'] }
}

const scssLoader = {
  test: /\.scss$/,
  loader: 'style-loader!css-loader!sass-loader'
}

const urlLoader = {
  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
  loader: 'url-loader?limit=100000'
}

const webpackConfig = {
  entry: './app/main.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: { loaders: [ babelLoader, scssLoader, urlLoader ] }
}

if (process.env.NODE_ENV === 'production') {
  // Minify for production build
  webpackConfig.plugins = [ new BabiliPlugin({}) ]
} else {
  // Generate sourcemaps for dev build
  webpackConfig.devtool = 'eval-source-map'
}

module.exports = webpackConfig
