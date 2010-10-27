var spawn = require('child_process').spawn,
    inspect = require('sys').inspect,
    git = exports;

git.clone = function (url, directory, folderName, cb) {
  cb = arguments[arguments.length - 1];
  var _cwd = directory || 'tmp/';
  var gitExec = spawn('git', ["clone", url, folderName], {cwd : _cwd});
  //console.log('git: ' + inspect(gitExec, true));
  gitExec.on('exit', function () {
    console.log("git exit");
    if (typeof(cb) === 'function') {
      cb();
    }
  });

  gitExec.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  gitExec.stderr.on('data', function (data) {
    cb(data.toString());
  });
};



