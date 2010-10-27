var spawn = require('child_process').spawn,
    inspect = require('sys').inspect,
    git = exports;

git.clone = function (url, directory, folderName, cb) {
  cb = arguments[arguments.length - 1];
  var _cwd = directory || 'tmp/';
  cmdLineArgs = ["clone", url];
  if (arguments.length === 4) {
    cmdLineArgs.push(folderName);
  }

  var gitExec = spawn('git', cmdLineArgs, {cwd : _cwd});
  
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



