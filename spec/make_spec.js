var describe = require('Jody').describe,
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');

var dir = "./tmp/makeTest";


var Make = function () {
  var self = this;


  self.runConfigure = function (directory) {
    var makeConfig = spawn('sh', ['./configure'],  {cwd: directory });
  };

  self.run = function (directory,makeArgs, cb) {
    path.exists(directory + '/configure', function (exists) {

      if (exists) {
        self.runConfigure(directory);
      }

      cb();

    });

  };

};




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
  it("Should run task", function () {
    var makeRun = false,
    make = new Make();
    
    make.run(dir, "test", function () {
      path.exists(dir + '/makeTest.txt', function (exists) {
      makeRun = exists;
    });

    })

  atEnd(function () {
    makeRun.should.beTrue();
  });

  });

