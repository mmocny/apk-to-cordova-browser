#!/usr/bin/env node

var Q = require('q');

/******************************************************************************/

function apkToCordovaBrowser(apkFile, outDir) {

  var scope = {};

  // Start the promise train..
  Q.when() // TODO: using Q.all() throws an error when calling .done(), file an issue with Q?

  // 1. Extract apk (zip) file to a temporary directory
  .then(function() {
    return require('./extractZipFileToTempDir')(apkFile)
      .then(function(zipDir) {
        scope.zipDir = zipDir;
      });
  })

  // 2. Get its packageId from AndroidManifest.xml
  .then(function() {
    return require('./parseAndroidManifest')(apkFile)
      .then(function(manifestInfo) {
        var packageId = manifestInfo['@package'];
        scope.packageId = packageId;
      });
  })

  // 3. Create a cordova-browser project with the right name and packageId, copying the www/ directory
  // 4. Re-install plugins, using the list inside cordova_plugins.js
  // 5. Clean up www/ (remove cordova.js, cordova_plugins.js, plugins/, ...)
  // 6. Add cordova-browser platform
  // 7. Console.log the path to browser platforms' www/

  .then(function() {
    console.log(scope);
  })
  .done();
}

/******************************************************************************/

module.exports = exports = apkToCordovaBrowser;
