var childProcess = require('child_process');
var rake = require('./rake');
var git = require('./git');

var buildServer = exports;

buildServer.createTempFolderName = function (url) {
 var date = new Date(); 
 return process.cwd() + '/tmp/' + date.getTime().toString();
};

buildServer.cloneSourceCode = function(url, directory, cb) {
  git.clone(url,directory,"RoRTodo", cb);
};

buildServer.runRake = function (directory) {
  rake.run(directory);
};

buildServer.mkdir = function (path, fn) {
  childProcess.exec('mkdir -p ' + path, function(err){
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('   create : ' + path);
    fn && fn();
  });
};

buildServer.execBuild = function (url) {
  var folderName = this.createTempFolderName(url);  
  this.mkdir(folderName, function (err) {
    if(err) {
      console.log(err);
      throw err;
    }

    buildServer.cloneSourceCode(url,folderName, function (err) {
      if(err) {
        console.log(err);
        throw err;
      }
      console.log('Rake '+ folderName + '/RoRTodo/');
      buildServer.runRake(folderName + '/RoRTodo/');
    });    
  });

}




