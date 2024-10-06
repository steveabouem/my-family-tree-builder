const path = require('path');

module.exports = {
  // ... rest
  resolve: {
    resolve: {
      alias: {
        root: path.resolve(__dirname, 'src/'),
        ['@pages']: path.resolve(__dirname, 'src/pages'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        components: path.resolve(__dirname, 'src/components'),
        contexts: path.resolve(__dirname, 'src/contexts'),
      }
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
}
