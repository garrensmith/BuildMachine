var spawn = require('child_process').spawn,
    fs = require('fs'),
    events = require('events'),
    path = require('path');



var Make = function () {
  var self = this;

  events.EventEmitter.call(this);

  self.runConfigure = function (directory, cb) {
    var configExec = spawn('sh', ['./configure'],  {cwd: directory });
      
    configExec.stdout.setEncoding('utf8');
    configExec.stdout.on('data', function (data) {
      self.emit('update', data);
    });

     configExec.stderr.setEncoding('utf8');
    configExec.stderr.on('data', function (data) {
      self.emit('update', data);
    });


    configExec.on('exit', function (code, signal) {
      cb(code);
    });
  };

  self.runMake = function (directory,makeArgs, cb) {
    var makeExec = spawn('make', makeArgs || [], {cwd: directory }); 

    makeExec.stdout.setEncoding('utf8');
    makeExec.stdout.on('data', function (data) {
      self.emit('update', data);
    });

    makeExec.stderr.setEncoding('utf8');
    makeExec.stderr.on('data', function (data) {
      self.emit('update', data);
    });


    makeExec.on('exit', function (code, signal) {
      cb(code);

    });

  };

  self.run = function (directory,makeArgs, cb) {
    path.exists(directory + '/configure', function (exists) {

      if (exists) {
        self.runConfigure(directory, function () {
          self.runMake(directory, makeArgs, cb);
        });
      } else {
        self.runMake(directory, makeArgs, cb);
      }


    });

  };

};

require('sys').inherits(Make, events.EventEmitter);
module.exports = Make;


