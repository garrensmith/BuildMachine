var childProcess = require('child_process');
var rake = require('./rake');
var git = require('./git');

var buildServer = exports;

buildServer.cloneSourceCode = function(url, directory, cb) {
  git.clone(url,directory, cb);
};

buildServer.runRake = function (directory) {
  rake.run(directory);
}

buildServer.mkdir = function (path, fn) {
    childProcess.exec('mkdir -p ' + path, function(err){
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('   create : ' + path);
        fn && fn();
    });
}


