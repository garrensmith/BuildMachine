var spawn = require('child_process').spawn;

var rake = exports;

rake.run = function (directory, command) { 
  command = command || 'default'
  rakeExec = spawn('rake', [command], {cwd: directory });

   /* rakeExec.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        //socket.write(data);
      });

    rakeExec.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        //socket.write(data);
    });*/
  
};

