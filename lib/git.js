var spawn = require('child_process').spawn,
    inspect = require('sys').inspect,
    events = require('events');


var Git = function () {
  var self = this;
  
  events.EventEmitter.call(this);

  self.clone = function (url, folderLocation, folderName, cb) {
    cb = arguments[arguments.length - 1];

    cmdLineArgs = ["clone", url];
    if (arguments.length === 4) {
      cmdLineArgs.push(folderName);
    }

    var gitExec = spawn('git', cmdLineArgs, {cwd : folderLocation});

    gitExec.stderr.on('data', function (data) {
     console.log(data.toString());
     self.emit('update', data.toString());
  });

    gitExec.stdout.on('data', function (data) {
    console.log(data.toString());
    self.emit('update', data.toString());
  });


  };
};

require('sys').inherits(Git, events.EventEmitter);

module.exports = Git;




