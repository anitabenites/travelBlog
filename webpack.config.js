module.exports = {
    entry: './static/js/index.js',
    output: {
        path: __dirname + '/static/js/',
        filename: 'bundle-server.js'
    },
    watch: true,
    historyApiFallback: true,
    module: {
        loaders: [{
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }]
    }
}