/* eslint-disable global-require */
const users = require('./users');
const generic = require('./generic');

module.exports = {
  generic,
  users,
  ...require('./auth.routes'),
};
