var spawn = require('child_process').spawn,
    fs = require('fs'),
    events = require('events');



var Rake = function () {
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

  self.run = function (directory,rakeArgs, cb) {
    var rakeExec = spawn('rake', rakeArgs || [], {cwd: directory }); 

    rakeExec.stdout.setEncoding('utf8');
    rakeExec.stdout.on('data', function (data) {
      self.emit('update', data);
    });

    rakeExec.stderr.setEncoding('utf8');
    rakeExec.stderr.on('data', function (data) {
      self.emit('update', data);
    });


    rakeExec.on('exit', function (code, signal) {
      cb(code);

    });

  };


};

require('sys').inherits(Rake, events.EventEmitter);
module.exports = Rake;



