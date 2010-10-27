var fs = require('fs');
var child_process = require('child_process');
var spawn = child_process.spawn;
var git = exports;

git.clone = function (url, directory, folderName, cb) {
  cb = arguments[arguments.length - 1];
  var _cwd = directory || 'tmp/';
  var git_cmd = spawn('git', ["clone", url, folderName], {cwd : _cwd});

  git_cmd.on('exit', function () {
    console.log("git exit");
    //if (typeof(cb) === 'function') {
      cb();
    //}
  });

  git_cmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  git_cmd.stderr.on('data', function (data) {
    cb(data.toString());
  });
};






/*child_process.exec("rm -r " + 'tmp').on('exit',function(err){
  console.log(err)
  fs.mkdirSync('tmp',0777);
  });

/*var git = spawn('git',["clone","git@github.com:garrensmith/TodoMyWay.git"],{cwd : 'tmp/'});

git.stdout.on('data', function (data) {
console.log(data.toString());
});

git.stderr.on('data', function(data){
sys.print('stderr: ' + data);
});

git.on('exit', function(){
console.log("done");
});*/

//});
/*git.clone("git@github.com:garrensmith/TodoMyWay.git",function(){
  console.log("in callback");
  });

  console.log('the end')*/

