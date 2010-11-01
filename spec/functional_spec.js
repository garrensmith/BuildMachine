var describe = require('Spec_My_Node').describe;
var buildServer = require('../lib/buildServer');


describe("Build Server").
  it("Should build ok", function () {
    buildServer.execBuild("/Users/garren/WebDev/RoRToDo/", "db:migrate spec");
  });/*.
  it("Should run 3 at same time", function () {
    buildServer.execBuild("/Users/garren/WebDev/ToDo/");
    buildServer.execBuild("/Users/garren/WebDev/RoRToDo/","db:migrate spec");
  });*/

