var childProcess = require('child_process'),
    events = require('events'),
    rake = require('./rake'),
    git = require('./git'),
    inspect = require('sys').inspect,
    events = require('events');


function BuildServer() {
    events.EventEmitter.call(this);
}

// inherit events.EventEmitter
BuildServer.super_ = events.EventEmitter;
BuildServer.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: BuildServer,
        enumerable: false
    }
});

var buildServer = new BuildServer();

module.exports = buildServer;

buildServer.messages = [];
var message = {
  time : "",
  msg : ""
};

buildServer.completed = false;
buildServer.result = 0;

var outputCallBack = function (data, code) {
    if (arguments.length > 1) {
      buildServer.completed = true;
      buildServer.result = code;
      console.log("completed with " + code);
      return;
    };
  
    var newMsg = Object.create(message);
    newMsg.time = new Date().getTime();
    newMsg.msg = data.toString();

    buildServer.messages.push(newMsg);

    buildServer.emit('update', newMsg);
  };

buildServer.query = function (timeStamp) {
  var latestMessages = [], 
      i = 0;
  buildServer.messages.forEach(function (msg) {
    if(msg.time > timeStamp) {
      latestMessages.push(msg);
    }
  });
  
  return latestMessages;
};

buildServer.createFolderPath = function (url) {
 var date = new Date(); 
 return process.cwd() + '/tmp/' + date.getTime().toString();
};

buildServer.createFolderName = function () {
  return Math.floor(Math.random()*9999)
};

buildServer.cloneSourceCode = function(url, directory,folderName, cb) {
  git.clone(url,directory,folderName, outputCallBack, cb);
};


buildServer.runRake = function (directory, rakeCommands) {
  rake.run(directory, rakeCommands, outputCallBack);
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

buildServer.execBuild = function (clientId, url, rakeCommands) {
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

};





