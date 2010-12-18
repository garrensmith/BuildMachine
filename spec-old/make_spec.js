var describe = require('Jody').describe,
    spawn = require('child_process').spawn;

var dir = "./tmp/makeTest";

var Make = function () {
  var self = this;

  self.run = function (directory) {

  };

};

describe('Configure').
  it("Should execute configure if it exists", function () {
    var make = new Make();

    make.run(dir);

  });
