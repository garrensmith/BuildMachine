/*var git_cmd_mock = function(){};
git_cmd_mock.on = function(data,cb){};
git_cmd_mock.stdout = function(){};
git_cmd_mock.stdout.on = function(data, cb){};
git_cmd_mock.stderr = function(){};
git_cmd_mock.stderr.on = function(data, cb){};

var spawn_opt = "";
 var spawn = function(cmd,arg,opt){
      var arg = arg;
      spawn_opt = opt;
     return git_cmd_mock;   
  }

require('child_process').spawn = spawn;
var git = require('./git');

exports['Should create path if specified'] = function(assert){
  git.clone("","my_path/",function(){}); 
  assert.equal(spawn_opt.cwd,"my_path/");
};

exports['Should create default path'] = function(assert){
  console.log(require('sys').inspect(spawn));

  git.clone("","",function(){});  
  assert.equal(spawn_opt.cwd,"tmp/");

};

exports['Should Report Error If Failure'] = function(assert){
  git.clone("","",function(error){
  assert.equal(error, "fatal: could not create work tree dir ''.: No such file or directory\n");    
  });
};


exports['Should initialise a new repo and return git object'] = function(assert){
  git.repo("path/to/repo");
};

exports['Should get the commits for a repo'] = function(assert){
  var commits = git.commits();
  assert.length(commits, 4);
});*/





