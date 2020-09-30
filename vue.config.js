const { join } = require('path');
const antDesignTheme = require('./config/ant-design-theme');

module.exports = {
  chainWebpack: (config) => {
    config.module.rules.delete('svg');
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /.html$/,
          loader: 'vue-template-loader',
          exclude: /index.html/,
          options: {
            transformAssetUrls: {
              img: 'src',
            },
          },
        },
        {
          test: /\.svg$/,
          loader: 'vue-svg-loader',
        },
      ],
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.common',
        ws: join(__dirname, 'node_modules/ws/index.js'), // https://github.com/websockets/ws/issues/1538
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        name: true,
        cacheGroups: {
          // Add large packages that aren't required for the initial load here
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: false,
            enforce: true,
          },
          default: {
            minChunks: 2,
            name: 'default',
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: antDesignTheme,
        javascriptEnabled: true,
      },
    },
  },
  transpileDependencies: ['vuex-module-decorators'],
  devServer: {
    disableHostCheck: true,
  },
  productionSourceMap: false,
};
