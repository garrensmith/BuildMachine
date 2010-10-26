var describe = require('Spec_My_Node').describe;
var fs = require('fs');
var childProcess = require('child_process');
var git = require('../lib/git'); 
var rake = require('../lib/rake');

//create temp directory
//clone into
//run spec

function mkdir(path, fn) {
    childProcess.exec('mkdir -p ' + path, function(err){
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('   create : ' + path);
        fn && fn();
    });
}

var buildServer = function() {};
buildServer.cloneSourceCode = function(url, directory, cb) {
  git.clone(url,directory, cb);
};

buildServer.runRake = function (directory) {
  rake.run(directory);
}

/*describe("Build Server with git url").
  it("Should create tmp directory", function () {
    var date = new Date();
    var tempFolder = 'tempFolder-' + date.getTime().toString(); 
    mkdir(process.cwd() + '/spec/tmp/' + tempFolder);
    
    var files = fs.readdirSync(process.cwd() + '/spec/tmp');
    console.log(files);
    
    files.should().contain(tempFolder);     
  });*/


describe("Acquire Source Code").
  it("Should do a git clone for code", function () {
    var methodCalled = false;
    git.clone = function (url, directory, cb) {
      url.should().beEqual("git-url");
      directory.should().beEqual("directory");
      methodCalled = true;
    };
    buildServer.cloneSourceCode("git-url","directory",function () {});
    
    methodCalled.should().beTrue();
  });

describe("Build code").
  it("Should run rake", function () {
    var methodCalled = false;
    rake.run = function (directory) {
      methodCalled = true;
      directory.should().beEqual("directory");
    };
    buildServer.runRake("directory");

    methodCalled.should().beTrue;
  });

