const webpack = require('webpack');
const path = require('path');
const $config = require('./config');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
// 解决内网代理问题。（如不需要代理，请删除以下一行代码）
// const HttpsProxyAgent = require('https-proxy-agent')
// 由开发者指定本地环境变量的代理配置字段名。这里以读取 HTTP_PROXY 字段为例（如不需要代理，请删除以下一行代码）
// const proxyServer = process.env.HTTP_PROXY;
// 使用cos存储的静态资源引用路径
const publicPath = process.env.NODE_ENV === 'production' ? $config.cdnRoot : '';

function resolve(dir) {
  return path.join(__dirname, dir);
}

function createExternals() {
  const cdnBase = 'https://lib.baomitu.com';
  // 公共库的cdn引入处理（webpack externals功能启用 + index.html中cdn资源的引入）
  return $config.externals.map((external) => {
    const obj = {};
    obj.path = cdnBase + external.path;
    obj.attributes = { crossorigin: 'anonymous' };
    if (external.packageName) {
      obj.external = {
        packageName: external.packageName,
        variableName: external.variableName,
      };
    }
    return obj;
  });
}

module.exports = {
  publicPath,
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        css: resolve('src/assets/css'),
        pages: resolve('src/pages'),
      },
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackTagsPlugin({
        usePublicPath: false,
        tags: createExternals(),
      }),
      new webpack.DefinePlugin({
        'process.env.APIMODE': JSON.stringify(process.env.APIMODE),
      }),
    ],
  },
  devServer: {
    port: $config.devServerPort,
    proxy: {
      '/dev': {
        target: $config.debug,
        // 解决内网代理问题。（如不需要代理，请删除以下agent代码）
        // agent: new HttpsProxyAgent(proxyServer),
        changeOrigin: true,
        pathRewrite: {
          '^/dev': '',
        },
        logLevel: 'debug',
      },
    },
  },
  runtimeCompiler: true,
  pluginOptions: {
    svgSprite: {
      dir: 'src/assets/icon',
      test: /\.(svg)(\?.*)?$/,
      loaderOptions: {
        extract: false,
      },
      pluginOptions: {
        plainSprite: false,
      },
    },
  },
};
