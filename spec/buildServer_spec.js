var describe = require('Jody').describe;

var url = "/Users/garren/WebDev/Jody/",
    directory = "./tmp";






// mocking required

describe('Build Server').
it("Should create folder for run", function () {
  var bs = new Buildserver();
  bs.run(url, directory);



});
