import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
    entry: './src/blazorInterop.ts',
    output: {
        path: path.resolve('./../wwwroot/js/dist'),
        filename: 'blazorInterop.bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'production'
};

export default config;