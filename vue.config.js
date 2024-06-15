const path = require('path');
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '~api': path.resolve(__dirname, './src/services/api.service'),
        '~common': path.resolve(__dirname, './src/components/common'),
        '~fields': path.resolve(__dirname, './src/components/common/Fields'),
        '~svg': path.resolve(__dirname, './src/assets/img/svg')
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: []
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  }
};
