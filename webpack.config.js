const path = require('path');

module.exports = {
    mode: 'development',
    cache: false,
    entry: './resources/index.js',
    output: {
        path: path.resolve(__dirname, 'www/js'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            plugins: ['@babel/plugin-proposal-object-rest-spread']
                        }
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpe?g|gif)$/i,
                use: [
                    'file-loader'
                ],
            }
        ]
    }
};