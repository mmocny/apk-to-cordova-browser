#!/usr/bin/env node

var shelljs = require('shelljs');
var fs = require('fs');
var path = require('path');
var Q = require('q');
var util = require('util');

/******************************************************************************/

function extractZipFileToTempDir(zipFile) {
  // TODO: create real temp directory
  var tempDirName = path.resolve("TempZipOutput");

  shelljs.rm('-rf', tempDirName);
  shelljs.mkdir('-p', tempDirName);

  return Q.Promise(function(resolve, reject) {
    shelljs.exec(util.format('unzip -q -d %s %s', tempDirName, zipFile));
    resolve(tempDirName);
    // TODO: this unzip lib fails with apk's
    /*
    fs.createReadStream(zipFile)
      .pipe(unzip.Extract({ path: tempDirName }))
      .on('entry', function (entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File'
        var size = entry.size;

        // TODO: Filter all but AndroidManifest.xml and assets/www/
        //if (fileName === "this IS the file I'm looking for") {
        //  entry.pipe(fs.createWriteStream('output/path'));
        //} else {
        //  entry.autodrain();
        //}
      })
      .on('close', function () {
        console.log.apply(console, arguments);
        resolve(tempDirName);
      });
    */
  });
}

/******************************************************************************/

module.exports = exports = extractZipFileToTempDir;

