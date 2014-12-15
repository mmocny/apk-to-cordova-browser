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

  // If there is no cordova_plugins.js, this isn't a valid Cordova app!
  .catch(function() {
    return Q.reject(path.basename(apkFile) + ' is is not a valid Cordova App!');
  })

  // Retrieve cordova version, using cordova.js
  .then(function() {
    // TODO
  })

  // Retrieve startPage using config.xml
  .then(function() {
    return require('./parseConfigXml')(apkFile)
      .then(function(startPage) {
        scope.startPage = startPage;
      });
  })

  // Clean up www/ (remove cordova.js, cordova_plugins.js, plugins/, ...)
  .then(function() {
    var prefix = path.join(scope.zipDir, 'assets', 'www');
    var toRemove = ['cordova.js', 'cordova_plugins.js', 'plugins'];
    toRemove.forEach(function(item) {
      shelljs.rm('-rf', path.join(prefix, item));
    });
  })

  // Create a cordova-browser project with the right name and packageId, copying the www/ directory
  .then(function() {
    var cdvCommands = require('./cdvCommands');
    shelljs.rm('-rf', outDir);
    return cdvCommands.runCordovaCommand(['create', outDir, scope.packageId, path.basename(outDir), {
      lib: {
        www: {
          url: path.join(scope.zipDir, 'assets', 'www')
        }
      }
    }]);
  })

  // Delete zipDir
  .then(function() {
    shelljs.rm('-rf', scope.zipDir);
  })

  // cd project
  .then(function() {
    process.chdir(outDir);
  })

  // Add cordova-browser platform
  .then(function() {
    var cdvCommands = require('./cdvCommands');
    return cdvCommands.runCordovaCommand(['platform', 'add', 'browser']);
  })

  // Re-install plugins
  .then(function() {
    var cdvCommands = require('./cdvCommands');
    cmds = [];
    Object.keys(scope.plugins).forEach(function(pluginId) {
      cmds.push(['plugin', 'add', pluginId]);
    });
    return cdvCommands.chainCordovaCommands(cmds, { ignoreFailures: true });
  })

  // cd ..
  .then(function() {
    process.chdir(path.join('..'));
  })

  // Thats it!
  .done(function() {
    // console.log the path to browser platforms' www/
    console.log(path.resolve(path.join(outDir, 'platforms', 'browser', 'www', scope.startPage)));
  }, function(err) {
    console.error(err);
  });
}

/******************************************************************************/

module.exports = exports = apkToCordovaBrowser;
