const path = require('path');

module.exports = {
  jarPath: path.join(__dirname, 'ktfmt.jar'),
  version: require('./package.json').version
};