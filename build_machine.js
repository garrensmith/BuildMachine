/**
 * Utils.
 */

var mem = process.memoryUsage();
// every 10 seconds poll for the memory.
setInterval(function () {
  mem = process.memoryUsage();
}, 10*1000);



/**
 * Module dependencies.
 */

var express = require('express'),
    buildServer = require('./lib/buildServer'),
    inspect = require('sys').inspect;

buildServer.on('data', function (data) {
  console.log("data: " + data);
});


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
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

app.post('/url',function(req,res) {
  //buildServer.execBuild("/Users/garren/WebDev/RoRToDo/", "db:migrate spec");
  buildServer.messages = [];
  buildServer.completed = false;
  buildServer.execBuild("/Users/garren/Projects/DrivenMetrics/", "mono");


  res.send({ some: 'json' });
});

app.post('/update', function(req, res) {
  if (buildServer.completed === true) {
    res.send({completed : true, code : buildServer.result});
    return;
  }
  var latest = buildServer.query(parseInt(req.body.timestamp,10));
  if (latest.length > 0) {
  res.send({rss: mem.rss, timestamp: latest[latest.length -1].time , messages: latest});
  }
  else {
    res.send({rss: mem.rss});
  };

});

app.get('/log', function (req, res) {
  buildServer.messages.forEach(function (msg) {
    console.log("msg time: " + msg.time);
    console.log("msg : " + msg.msg);
  });

});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
