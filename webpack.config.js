const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // 入口文件
  entry: './src/index.js',
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // 输出为 ESModule 格式
    // library: {
    //   type: 'module'
    // }
  },
  // 模式设置为生产模式，Webpack 会自动进行一些优化
  mode: 'production',
  // 优化配置
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  }
};