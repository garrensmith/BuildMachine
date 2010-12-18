var Make = require('./make'),
    Rake = require('./rake'),
    Git = require('./git'),
    path = require('path');
    events = require('events'),
    EventEmitter = events.EventEmitter;


var BuildServer = function (builder) {
  var self = this;

  EventEmitter.call(this);

  if (builder === "make") {
    self.builder = new Make();

  } else {
    self.builder = new Rake(); 
  }

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

      self.builder.on('update', function (data) {
        self.emit('update', data);
      });

      self.builder.run(path.join(directory, folderName), buildArgs, function (code) {
        self.emit('exit', code);

      });
    });


  };
};

require('sys').inherits(BuildServer, events.EventEmitter);


module.exports = BuildServer;





