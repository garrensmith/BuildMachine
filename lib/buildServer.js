var Make = require('./make'),
    Git = require('./git'),
    path = require('path');
    events = require('events'),
    EventEmitter = events.EventEmitter;


var BuildServer = function () {
  var self = this;

  EventEmitter.call(this);

  self.createFolderName = function () {
    var date = new Date();
    return date.getTime().toString();
  }

  self.run = function (url, directory, buildArgs) {
    var git = new Git();

    git.on('update', function (data) {
      self.emit('update', data);
    });

    var folderName = self.createFolderName();
    git.clone(url, directory, folderName, function (code) {

      if (code != 0) {
        self.emit('exit', code);
        return;
      }
      var make = new Make();

      make.on('update', function (data) {
        self.emit('update', data);
      });

      make.run(path.join(directory, folderName), buildArgs, function (code) {
        self.emit('exit', code);

      });
    });


  };
};

require('sys').inherits(BuildServer, events.EventEmitter);


module.exports = BuildServer;





