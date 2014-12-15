#!/usr/bin/env node

var path = require('path');
var Q = require('q');
var exec = require('child_process').execFile;

/******************************************************************************/

function parseAndroidManifest(apkFile) {
  /*
  // TODO: This was failing on some apps :(
  return Q.nfcall(parseApk, apkFile).then(function(info) {
    return info.manifest[0];
  });
  */
  var aapt = path.resolve(path.join(__dirname, '..', 'node_modules', 'apk-parser', 'tools', 'aapt'));

  return Q.nfcall(exec, aapt, ['d', 'xmltree', apkFile, 'AndroidManifest.xml'], {
    maxBuffer: 1024 * 1024
  }).then(function(out) {
    var lines = out.toString().split('\n');
    var packageId;
    lines.forEach(function(line, i) {
      if (line.indexOf('package') !== -1) {
        packageId = line.match(/\(Raw\: \"(.*)\"\)/)[1];
      }
    });
    if (!packageId) {
      return Q.reject('Could not parse AndroidManifest.xml');
    }
    return packageId;
  });
}

/******************************************************************************/

module.exports = exports = parseAndroidManifest;

