
module.exports = {
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:3000',
        changeOrigin: true, // so CORS doesn't bite us. 
      }
    }
  }
}