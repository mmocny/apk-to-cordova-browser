#!/usr/bin/env node

var Q = require('q');
var shelljs = require('shelljs');
var fs = require('fs');
var path = require('path');

/******************************************************************************/

function apkToCordovaBrowser(apkFile, outDir) {
  var scope = {};

  // Start the promise train..
  Q.all([])

  // Extract apk (zip) file to a temporary directory
  .then(function() {
    return require('./extractZipFileToTempDir')(apkFile)
      .then(function(zipDir) {
        scope.zipDir = zipDir;
      });
  })

  // Get its packageId from AndroidManifest.xml
  .then(function() {
    return require('./parseAndroidManifest')(apkFile)
      .then(function(manifestInfo) {
        var packageId = manifestInfo['@package'];
        scope.packageId = packageId;
      });
  })

  // Retrieve plugin list, using cordova_plugins.js
  .then(function() {
    var data = fs.readFileSync(path.join(scope.zipDir, 'assets', 'www', 'cordova_plugins.js'), 'utf-8');
    var pluginsJson = data.split('METADATA')[1];
    pluginsJson = pluginsJson.substring(0, pluginsJson.lastIndexOf('\n'));
    var plugins = JSON.parse(pluginsJson);
    scope.plugins = plugins;
  })

  // Retrieve cordova version, using cordova.js
  .then(function() {
    // TODO
  })

  // Clean up www/ (remove cordova.js, cordova_plugins.js, plugins/, ...)
  .then(function() {
  })

  // Create a cordova-browser project with the right name and packageId, copying the www/ directory
  .then(function() {
  })

  // Delete zipDir
  .then(function() {
    shelljs.rm('-rf', scope.zipDir);
  })

  // Add cordova-browser platform
  .then(function() {
  })

  // Re-install plugins
  .then(function() {
  })

  // console.log the path to browser platforms' www/
  .then(function() {
  })


  // TODO: Debug
  .then(function() {
    console.log(scope);
  })
  .done();
}

/******************************************************************************/

module.exports = exports = apkToCordovaBrowser;
