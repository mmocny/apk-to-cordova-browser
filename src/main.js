#!/usr/bin/env node

/******************************************************************************/

function main() {
  var argv = require('./parseCommandLine')();
  var apkFile = argv._[0];
  if (typeof apkFile !== 'string' || argv.h) {
    return require('optimist').showHelp();
  }

  var path = require('path');
  var apkFileExtension = path.extname(apkFile);
  if (apkFileExtension !== '.apk') {
    return console.error('Expected a *.apk file.');
  }

  // Use the --out argument if given, or create a directory with the same name as the apk by default.
  var outDir = argv.o || path.basename(apkFile).split(apkFileExtension)[0];
  return require('./apkToCordovaBrowser')(apkFile, outDir);
}

/******************************************************************************/

if (require.main === module) {
    main();
}
