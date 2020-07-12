if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/my-component.min.js');
} else {
  module.exports = require('./dist/my-component.js');
}
