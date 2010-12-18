var describe = require('Jody').describe,
    spawn = require('child_process').spawn,
    fs = require('fs'),
    events = require('events'),
    path = require('path');

var dir = "./tmp/makeTest";


var Make = function () {
  var self = this;

  events.EventEmitter.call(this);

  self.runConfigure = function (directory, cb) {
    var configExec = spawn('sh', ['./configure'],  {cwd: directory });

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





describe('Configure').
it("Should execute configure if it exists", function (atEnd) {
  var configureRun = false,
  make = new Make();

make.run(dir,"", function () {
  path.exists(dir + '/test.txt', function (exists) {
    configureRun = exists;
  });
});


atEnd(function () {
  configureRun.should().beTrue();
});


});

describe('Make').
  it("Should run task", function (atEnd) {
    var makeRun = false,
    make = new Make();

    make.run(dir, ["test"], function () {
    path.exists(dir + '/makeTest.txt', function (exists) {
      makeRun = exists;
    });

  })

  atEnd(function () {
    makeRun.should().beTrue();
  });
}).
  it("Should emit update info", function (atEnd) {
    var makeData = "",
    make = new Make();

    make.run(dir, ["test"], function () {});


    make.on('update', function (data) {
      console.log(data);
      makeData = data;
    });

    atEnd(function () {
      makeData.should().beEqual("echo \"make test\" >> makeTest.txt\n");
    });
}).
  it ("Should exit with status code", function (atEnd) {
    var makeCode = 5,
    make = new Make();

    make.run(dir, ["test"], function (code) {
      makeCode = code;
    
    });
    
    atEnd(function () {
      makeCode.should().beEqual(0);
    });

  });

