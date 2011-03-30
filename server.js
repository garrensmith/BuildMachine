/**
 * Utils.
 */

VERSION = "0.1.0";

var mem = process.memoryUsage();
// every 10 seconds poll for the memory.
setInterval(function () {
  mem = process.memoryUsage();
}, 10*1000);



/**
 * Module dependencies.
 */

var express = require('express'),
    BuildServer = require('./lib/buildServer'),
    inspect = require('sys').inspect,
    io = require('socket.io');


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index.jade', {
    locals: {
              title: 'Build Machine'
            }
  });
});



// socket.io 
var socket = io.listen(app); 
socket.on('connection', function(client){ 
  // new client is here! 
  client.on('message', function(message){ 

    if (message.gitUrl) {
      console.log(message);
      var builder = new BuildServer(message.srcBuilder);
      var buildArgs = message.buildCmd === "" ? undefined : message.buildCmd;
      

      builder.on('update', function(message) {
        client.send({rss: mem.rss, message : message}); 
      });

      builder.on('exit', function(code) {
        console.log("exited with " + code);
                
        client.send({rss: mem.rss, result : (code === 0).toString() });
      });


      builder.run(message.gitUrl, './tmp' ,[buildArgs]);
    }
  }); 


  client.on('disconnect', function(){ 
    console.log('client %s disconnected', client.sessionId);
  });

}); 


// Only listen on $ node app.js

if (!module.parent) {

  if(process.env.C9_PORT) {
    app.listen(C9_PORT);
    console.log("Express server on cloud9");
  } else {    
    app.listen(3000);
    console.log("Express server listening on port %d", app.address().port);
 }
}


//builder.execBuild("/Users/garren/Projects/DrivenMetrics/", "mono");
//builder.execBuild("/Users/garren/WebDev/WorshipHub/", "db:migrate spec");

