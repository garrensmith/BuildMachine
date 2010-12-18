var describe = require('Jody').describe,
    Make = require('../lib/make.js'),
    path = require('path');


var dir = "./tmp/makeTest";


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
  }).
  it("Should update on progress", function (atEnd) {
     var configureData = "",
    make = new Make();

    make.run(dir,"", function () { });
    
    make.on('update', function (data) {
      configureData += data;
      
    });

    atEnd(function () {
      configureData.should().contain("from configure");
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

