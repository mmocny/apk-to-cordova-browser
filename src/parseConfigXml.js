#!/usr/bin/env node

var Q = require('q');
var path = require('path');
var exec = require('child_process').execFile;

/******************************************************************************/

function parseConfigXml(apkFile) {
  var aapt = path.resolve(path.join(__dirname, '..', 'node_modules', 'apk-parser', 'tools', 'aapt'));

  return Q.nfcall(exec, aapt, ['d', 'xmlstrings', apkFile, 'res/xml/config.xml'], {
    maxBuffer: 1024 * 1024
  }).then(function(out) {
    var lines = out.toString().split('\n');
    var startPage;
    lines.forEach(function(line, i) {
      if (line.indexOf('content') !== -1) {
        startPage = lines[i+1].split(':')[1].trim();
      }
    });
    if (!startPage) {
      return Q.reject('Could not parse config.xml');
    }
    return startPage;
  });
}

/******************************************************************************/

module.exports = exports = parseConfigXml;
