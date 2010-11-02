var describe = require('Jody').describe;
var fs = require('fs');
var childProcess = require('child_process');
var buildServer = require('../lib/buildServer');
var git = require('../lib/git'); 
var rake = require('../lib/rake');

//create temp directory == random dir
//clone into
//run spec
describe('Folder creation').
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


describe("Event Callback").
  it("Should emit data on new data recieved", function () {
    var eventFired = false;

    buildServer.on('data', function (data) {
      data.msg.should().beEqual("zing bang");
      eventFired = true;
    });

    buildServer.emit('data', {msg : "zing bang"});

    eventFired.should().beTrue();
  });

describe("Message query").
  it("Should load only the latest messages", function () {
   var msg1 = {
      time : new Date(2010,08,08,12,01),
      msg : "msg1"
    };

   var msg2 = {
      time : new Date(2010,08,08,12,03),
      msg : "msg2"
    };

   var msg3 = {
      time : new Date(2010,08,08,12,04),
      msg : "msg3"
    };

    
    buildServer.messages.push(msg1);
    buildServer.messages.push(msg2);
    buildServer.messages.push(msg3);

    var latest = buildServer.query(new Date(2010,08,08,12,02));

    latest.length.should().beEqual(2);
    latest[0].msg.should().beEqual("msg2");
    latest[1].msg.should().beEqual("msg3");

  });


