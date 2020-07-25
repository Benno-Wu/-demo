var path = require('path');

module.exports = {
    entry: './src/index.js', //entry为入口文件，即webpack以这个文件为基础打包成另一个文件，所以entry文件包括了要导入的文件
    devtool: 'sourcemaps',
    cache: true,
    output: { //打包输出出bundle.js文件，这个文件就可以导入HTML中了
        path: __dirname,
        filename: '../static/bundle.js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use:[{
                    loader: 'babel-loader',
                    options:{
                        presets: ["@babel/preset-env","@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    }
                }]
            }
        ]
    }
};
