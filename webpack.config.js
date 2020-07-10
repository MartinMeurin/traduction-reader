module.exports = {
  module: {
    rules: [
      {
        test: /\.xlf$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
};