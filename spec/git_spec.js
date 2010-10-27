var describe = require('spec_my_node').describe,
    child_process = require('child_process'),
    inspect = require('sys').inspect;

 var spawn = child_process.spawn = function(cmd,arg,opt){
      spawn.arg = arg;
      spawn.opt = opt;
      spawn.cmd = cmd;
      spawn.onEventName;
      spawn.stdoutEventName;
      spawn.stderrEventName;

      spawn.on = function (eventName) {
        spawn.onEventName = eventName;
        return spawn;
      };
      
      spawn.stdout = function () {
        
      }

      spawn.stdout.on = function (eventName) {
        spawn.stdoutEventName = eventName
      }; 

      spawn.stderr = function () {
        
      }

      spawn.stderr.on = function (eventName) {
        spawn.stderrEventName = eventName
      }; 


      return spawn;
  };

var git = require('../lib/git');

describe('Child process').
  it("Should be called with git command", function () {
      git.clone("","", "");
      
      spawn.cmd.should().beEqual('git');

  }).
  it("Should setup exit event", function () {
    git.clone("","", function () {});
  
    spawn.onEventName.should().beEqual('exit');
  }).
 
describe('Outputs').
  it("Should register for stdout event", function () {
     git.clone("","", "");

     spawn.stdoutEventName.should().beEqual('data');
  }).
  it("Should register for stderr event", function () {
     git.clone("","", "");
     spawn.stderrEventName.should().beEqual('data');
  });

describe('Clone inputs').
  it("Should add clone directory if specified", function () {
    git.clone("url","clone directory","folderName", function () {});

    spawn.arg.should().contain("folderName");
  }).
  it("Should ignore clone folder if ignores", function () {
    git.clone("url","clone directory",function () {});

    spawn.arg.length.should().beEqual(2);

  });







