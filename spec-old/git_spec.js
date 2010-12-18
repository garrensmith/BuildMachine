var describe = require('Jody').describe,
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    Git = require('../lib/git.js');



var url = "/Users/garren/WebDev/Jody/",
    folderLocation = "./tmp",
    folderName = "testrepo" ;

//implement beforeAll and AfterAll to cleanup and setup tests

describe('Git Clone').
  beforeEach(function () {
    /*if (!path.exists("./tmp")) {
      fs.mkdirSync("./tmp", 0777);
    }*/

      
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
  }).
  afterAll( function () {
    spawn('rm', ["-rf", "./tmp/testrepo"]);
  });




