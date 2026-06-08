const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify"),
      "fs": false,
      "path": require.resolve("path-browserify"),
      "assert": require.resolve("assert/"),
      "os": require.resolve("os-browserify/browser"),
    }
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: []
      }
    ]
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
