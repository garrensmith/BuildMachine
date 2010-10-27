var describe = require('spec_my_node').describe,
  child_process = require('child_process'),
  inspect = require('sys').inspect;
 
var spawnMock = child_process.spawn = function (cmd,args,options) {
  spawnMock.cmd = cmd;
  spawnMock.args = args;
  spawnMock.optins = options;
  spawnMock.called = true;
};

rake = require('../lib/rake');


describe("Rake params").
  it("Should create child process with correct commands", function () {
    rake.run("directory");
    child_process.spawn.cmd.should().beEqual('rake');
  }).
  it("Should run default if no task given", function () {
    rake.run("directory");
    spawnMock.args.should().beEqual('default');
  }).
  it("Should run with supplied command", function () {
    rake.run("directory", "spec");
    spawnMock.args.should().beEqual("spec");
  });
/*  it("Should create child process", function () {
    var mockCalled = false;
        
    spawnMock = function(cmd, args, options) {
      cmd.should().beEqual(cmd);
      args.should().contain('default');
      options.cwd.should().beEqual(directory);
    }
    
    rake.run("directory");
    mockCalled.should().beTrue();
  });

describe("Failed Command").
  it("Should return error", function () {
    //pending
    var num = 1;
    num.should().beEqual(2);
  });*/
