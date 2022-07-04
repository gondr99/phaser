const path = require('path');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },

    devtool: 'inline-source-map',
    devServer:{
        static: path.resolve(__dirname, 'src'),
        port:9000
    }
}