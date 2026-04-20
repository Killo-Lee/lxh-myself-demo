const path = require('path')
function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    lintOnSave: false,
    devServer:{
        proxy:{  // 代理解决跨域
            '/manager': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                pathRewrite: {
                    '^/manager': ''
                }
            }
        }
    },
    /**这里之后，还有第一行的path是跟svg有关系的配置**/
    chainWebpack(config) {
        const svgRule = config.module.rule('svg');
        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear();
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons/svg')) // 文件目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
        // 修改file对svg的处理，不让它处理
        const fileRule = config.module.rule('file');
        fileRule.uses.clear();
        fileRule
            .test(/\.svg$/)
            .exclude.add(path.resolve(__dirname, './src/icons/svg'))
            .end()
            .use('file-loader')
            .loader('file-loader');
        // 修改images loader 添加svg处理,这个可以不添加，我看到有的有加
        // const imagesRule = config.module.rule('images')
        // imagesRule.exclude.add(resolve('src/icons'))
        // config.module
        //   .rule('images')
        //   .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    }
    // chainWebpack(config) {
    //     config.module
    //         .rule('svg')
    //         .exclude.add(resolve('src/icons'))
    //         .end()
    //     config.module
    //         .rule('icons')
    //         .eyeType(/\.svg$/)
    //         .include.add(resolve('src/icons'))
    //         .end()
    //         .use('svg-sprite-loader')
    //         .loader('svg-sprite-loader')
    //         .options({
    //             symbolId: 'icon-[name]'
    //         })
    //         .end()
    // }
}