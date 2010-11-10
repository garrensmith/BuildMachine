var spawn = require('child_process').spawn;
var inspect = require('sys').inspect;

var rake = exports;

rake.run = function (directory, commands, cb) { 
  //if (typeof(cb) !== 'function') cb = function () {};
  
  rakeExec = spawn('rake', commands || ['default'], {cwd: directory });
  // stream.setEncoding(encoding) 'utf8', 'ascii', or 'base64'
  rakeExec.stdout.setEncoding('utf8');
  rakeExec.stdout.on('data', function (data) {
    //console.log(data);
    cb(data);
  });

  rakeExec.stderr.on('data', function (data) {
    //console.log('stderr: ' + data);
    cb(data);
  });

  rakeExec.on('exit', function (code, signal) {
    console.log("woohoo I'm done");
    
    cb(null,code);
  });

};


