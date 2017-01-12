'use strict';

let SCRIPT = null;

if (__DEV__) {
  SCRIPT = require('./config.dev.json')['script'];
} else {
  SCRIPT = require('./config.prod.json')['script'];
}

module.exports = { SCRIPT };
