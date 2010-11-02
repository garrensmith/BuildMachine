var describe = require('Jody').describe,
    child_process = require('child_process'),
    inspect = require('sys').inspect;

var spawnMock = child_process.spawn = function (cmd,args,options) {
  spawnMock.cmd = cmd;
  spawnMock.args = args;
  spawnMock.optins = options;
  spawnMock.called = true;
  return spawnMock;
};

spawnMock_stdout = function () {
};

spawnMock_stdout.on = function(eventName, fn) {
  this.eventName = eventName;
};

spawnMock_stderr = function () {
};

spawnMock_stderr.on = function(eventName, fn) {
  this.eventName = eventName;
};

spawnMock.stdout = spawnMock_stdout;
spawnMock.stderr = spawnMock_stderr; 

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
}).
  it("Should supply multiple comamnds as array", function () {
   rake.run("directory",["db:migrate","spec"]);
   spawnMock.args.length.should().beEqual(2);
   spawnMock.args[1].should().beEqual("spec");
  });

describe("Std out setup").
  it("Should setup std out data event", function () {
  rake.run("fake");

  spawnMock_stdout.eventName.should().beEqual('data');

  }).
  it("Should setup std err data event", function () {
  rake.run("fake");

  spawnMock_stderr.eventName.should().beEqual('data');

  });

describe("Output callback").
  it("Should call the output callback on stdout event", function () {
    var wasCalled = false;
    rake.run("directory","rake cmd", function () {
      wasCalled = true;
    });
    
    wasCalled.should().beTrue();
  }).
  it("Should call the output callback on the stderr event", function () {
    var wasCalled = false;
    rake.run("directory","rake cmd", function () {
      wasCalled = true;
    });
    
    wasCalled.should().beTrue();
  });

