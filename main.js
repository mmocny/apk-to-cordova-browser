#!/usr/bin/env node

var path = require('path');

function apkToCordovaBrowser(path_to_apk) {
}

/******************************************************************************/

function parseCommandLine() {
  var optimist = require('optimist');
  return optimist
      .usage('Convert a cordova-based Android APK to a cordova-browser project.\nUsage: $0 [APK_FILE]')
      .options('h', {
          type: 'boolean',
          alias: 'help',
          desc: 'Show usage message.'
      })
      .argv;
}

function main() {
  var argv = parseCommandLine();
  if (argv.h) {
    return require('optimist').showHelp();
  }
  var apk = argv._[0];
  return apkToCordovaBrowser(apk);
}

/******************************************************************************/

exports.apkToCordovaBrowser = apkToCordovaBrowser;

if (require.main === module) {
    main();
}
