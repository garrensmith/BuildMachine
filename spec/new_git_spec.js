var describe = require('Jody').describe,
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
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
}

require('sys').inherits(Git, events.EventEmitter);

var url = "/Users/garren/WebDev/Jody/",
    folderLocation = "./tmp",
    folderName = "testrepo" ;

//implement beforeAll and AfterAll to cleanup and setup tests

describe('Git Clone').
  beforeEach(function () {
   /* if (!path.exists("./tmp")) {
      fs.mkdirSync("./tmp");
    }*/
    //var tt = spawn('rm', ["-rf", "./tmp/testrepo"]); 

      
    //}
  }).
  it("Should clone into specified folder", function (atEnd) {
    
    var git = new Git();
    git.clone(url, folderLocation, folderName, function () {});    
    
    atEnd(function () {
      var files = fs.readdirSync(folderLocation + "/" + folderName)
      files.length.should().beEqual(10);
    });
}).
  it("Should execute call back on clone completion", function (atEnd) {
    var called = false;
    var git = new Git();
    git.clone(url, folderLocation, folderName, function () {
      called = true;
    });    
    
    atEnd(function () {
      called.should().beTrue;
    });
  }).
  it("Should fire call back on information", function (atEnd) {
    var called = false;
    var git= new Git();
    
    git.clone(url, folderLocation, folderName, function () {
      called = true;
    });

    git.on('data', function () {
      called = true;
    });

    atEnd(function () {
      called.should().beTrue;
    });
  });




