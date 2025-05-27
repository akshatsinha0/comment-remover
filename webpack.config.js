const esbuild = require('esbuild');

module.exports = {
  entry: './out/extension.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode'
  },
  plugins: [
    new esbuild({
      minify: true,
      target: 'es2020'
    })
  ]
};
