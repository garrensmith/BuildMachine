var spawn = require('child_process').spawn,
    inspect = require('sys').inspect,
    git = exports;

git.clone = function (url, directory, folderName, logCallback ,cb) {
  cb = arguments[arguments.length - 1];
  if (typeof(logCallback) !== 'function') logCallback = function () {};
  
  var _cwd = directory || 'tmp/';
  cmdLineArgs = ["clone", url];
  if (arguments.length === 5) {
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
    logCallback(data);
  });

  gitExec.stderr.on('data', function (data) {
    logCallback(data);
    cb(data.toString());
  });
};



