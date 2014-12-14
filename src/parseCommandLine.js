#!/usr/bin/env node

/******************************************************************************/

function parseCommandLine() {
  var optimist = require('optimist');
  return optimist
      .usage('Convert a cordova-based Android APK to a cordova-browser project.\nUsage: $0 [APK_FILE]')
      .options('o', {
          type: 'string',
          alias: 'out',
          desc: 'Output directory.'
      })
      .options('h', {
          type: 'boolean',
          alias: 'help',
          desc: 'Show usage message.'
      })
      .argv;
}

/******************************************************************************/

module.exports = exports = parseCommandLine;
