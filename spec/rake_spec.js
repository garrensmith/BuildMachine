var describe = require('spec_my_node').describe,
    spawnMock = require('child_process').spawn,
    rake = require('../lib/rake');


describe("Exec rake").
  it("Should create child process", function () {
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
  });
