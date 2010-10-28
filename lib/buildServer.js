var childProcess = require('child_process');
var rake = require('./rake');
var git = require('./git');

var buildServer = exports;

buildServer.createFolderPath = function (url) {
 var date = new Date(); 
 return process.cwd() + '/tmp/' + date.getTime().toString();
};

buildServer.createFolderName = function () {
  return Math.floor(Math.random()*9999)
};

buildServer.cloneSourceCode = function(url, directory,folderName, cb) {
  git.clone(url,directory,folderName, cb);
};

buildServer.runRake = function (directory, rakeCommands) {
  rake.run(directory, rakeCommands);
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

buildServer.execBuild = function (url, rakeCommands) {
  var folderName = this.createFolderPath(url);  
  var projectName = this.createFolderName();
  this.mkdir(folderName, function (err) {
    if(err) {
      console.log(err);
      throw err;
    }

    buildServer.cloneSourceCode(url,folderName,projectName, function (err) {
      if(err) {
        console.log(err);
        throw err;
      }
      console.log('Rake '+ folderName + '/' + projectName);
      console.log("rc:" + rakeCommands);
      
      if (rakeCommands === undefined){
      buildServer.runRake(folderName +'/' +  projectName);
      }
      else {
        buildServer.runRake(folderName +'/' +  projectName,rakeCommands.split(' '));
      }
    });    
  });

}




