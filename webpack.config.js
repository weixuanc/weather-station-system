import * as path from 'node:path';
import TerserPlugin from 'terser-webpack-plugin';

export default {
  // 入口文件
  entry: './src/index.js',
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // 输出为 ESModule 格式
    library: {
      type: 'module'
    }
  },
  // 模式设置为生产模式，Webpack 会自动进行一些优化
  mode: 'production',
  // 优化配置
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // 启用 ESModule 压缩
          module: true
        }
      })
    ]
  },
  // 实验性功能配置，启用 ESModule 输出
  experiments: {
    outputModule: true
  }
};