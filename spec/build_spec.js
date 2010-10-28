var describe = require('Spec_My_Node').describe;
var fs = require('fs');
var childProcess = require('child_process');
var buildServer = require('../lib/buildServer');
var git = require('../lib/git'); 
var rake = require('../lib/rake');

//create temp directory == random dir
//clone into
//run spec
describe('Folder creation').
  it("Should ..", function () {
    var folderPath = buildServer.createFolderPath("git://github.com/garrensmith/RoRTodo.git");
    
    folderPath.should().beEqual(process.cwd() + '/tmp/' + 'RoRTodo');

  }).
  it("Should create random folder Name", function () {
    var name1 = buildServer.createFolderName();
    var name2 = buildServer.createFolderName();
    console.log(name1);
    console.log(name2);
    name1.should().notBeEqual(name2);
  });

describe('Folder creation').
  it('Should generate folder with date stamp', function (onCallBack) {
    buildServer.mkdir(process.cwd() + '/tmp'+ "/testDir");
    
    onCallBack( function () {
      var files = fs.readdirSync(process.cwd()  + '/tmp');
      files.should().contain('testDir');
    });
  });


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


