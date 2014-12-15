#!/usr/bin/env node

var Q = require('q');
var cordova = require('cordova-lib').cordova;

/******************************************************************************/

function runCordovaCommand(cmd) {
  return cordova.raw[cmd[0]].apply(cordova, cmd.slice(1));
}

function chainCordovaCommands(cmds) {
  return cmds.map(function(cmd) {
    // Be lazy: return a function that will return a promise, don't create the promise now
    return function() {
      return runCordovaCommand(cmd);
    };
  }).reduce(Q.when, Q.when());
}

/******************************************************************************/

exports.runCordovaCommand = runCordovaCommand;
exports.chainCordovaCommands = chainCordovaCommands;
