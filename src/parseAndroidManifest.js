#!/usr/bin/env node

var parseApk = require('apk-parser');
var Q = require('q');

/******************************************************************************/

function parseAndroidManifest(apkFile) {
  return Q.nfcall(parseApk, apkFile).then(function(info) {
    return info.manifest[0];
  });
}

/******************************************************************************/

module.exports = exports = parseAndroidManifest;

