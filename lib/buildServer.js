var childProcess = require('child_process'),
    events = require('events'),
    rake = require('./rake'),
    git = require('./git'),
    events = require('events'),
    EventEmitter = events.EventEmitter;


function BuildServer () {
    var self = this;

    EventEmitter.call(this);

    self.outputCallBack = function (data, code) {
    /*if (arguments.length > 1) {
      buildServer.completed = true;
      buildServer.result = code;
      console.log("completed with " + code);
      buildServer.emit('update', "");
      return;
    };*/
    
    if (data) {   
      self.emit('update', data.toString());
    }
    else if(code !== undefined) {
      self.emit('complete', code.toString());
    }
    
  };


};

require('sys').inherits(BuildServer, events.EventEmitter);


buildServer = module.exports; 

buildServer.builder = function () {
  return new BuildServer();
};


BuildServer.prototype.completed = false;
BuildServer.prototype.result = 0;


BuildServer.prototype.createFolderPath = function (url) {
 var date = new Date(); 
 return process.cwd() + '/tmp/' + date.getTime().toString();
};

BuildServer.prototype.createFolderName = function () {
  return Math.floor(Math.random()*9999)
};

BuildServer.prototype.cloneSourceCode = function(url, directory,folderName, cb) {
  git.clone(url,directory,folderName, this.outputCallBack, cb);
};


BuildServer.prototype.runRake = function (directory, rakeCommands) {
  rake.run(directory, rakeCommands, this.outputCallBack);
};

BuildServer.prototype.mkdir = function (path, fn) {
  childProcess.exec('mkdir -p ' + path, function(err){
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('   create : ' + path);
    fn && fn();
  });
};

BuildServer.prototype.execBuild = function (url, rakeCommands) {
  console.log("exec");
  this.emit("update","building");
  
  var folderName = this.createFolderPath(url);  
  var projectName = this.createFolderName();
  var that = this;
  this.mkdir(folderName, function (err) {
    if(err) {
      console.log(err);
      throw err;
    }

    that.cloneSourceCode(url,folderName,projectName, function (err) {
      if(err) {
        console.log(err);
        throw err;
      }
      console.log('Rake '+ folderName + '/' + projectName);
      console.log("rc:" + rakeCommands);
      
      if (rakeCommands === undefined){
      that.runRake(folderName +'/' +  projectName);
      }
      else {
        that.runRake(folderName +'/' +  projectName,rakeCommands.split(' '));
      }
    });    
  });

};





