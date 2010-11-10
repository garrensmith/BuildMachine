var spawn = require('child_process').spawn;
var inspect = require('sys').inspect;

var make = exports;

make.run = function (directory, commands, cb) { 
  //if (typeof(cb) !== 'function') cb = function () {};
  makeConfig = spawn('sh', ['./configure'],  {cwd: directory });
  // stream.setEncoding(encoding) 'utf8', 'ascii', or 'base64'
  makeConfig.stdout.setEncoding('utf8');
  makeConfig.stdout.on('data', function (data) {
    console.log(data);
    cb(data);
  });

  makeConfig.stderr.on('data', function (data) {
    console.log(data.toString());
    cb(data);
  });

  makeConfig.on('exit', function (code, signal) {
   console.log("woohoo configure done");

    //cb(null,code);


    makeExec = spawn('make', commands || [], {cwd: directory });
    // stream.setEncoding(encoding) 'utf8', 'ascii', or 'base64'
    makeExec.stdout.setEncoding('utf8');
    makeExec.stdout.on('data', function (data) {
      //console.log(data);
      cb(data);
    });

    makeExec.stderr.on('data', function (data) {
      //console.log('stderr: ' + data);
      cb(data);
    });

    makeExec.on('exit', function (code, signal) {
      console.log("woohoo I'm done");

      cb(null,code);
    });
  });

};



