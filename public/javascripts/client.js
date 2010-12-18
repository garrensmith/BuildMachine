
function updateRSS (rss) {
  var bytes = parseInt(rss);
  if (bytes) {
    var megabytes = bytes / (1024*1024);
    megabytes = Math.round(megabytes*10)/10;
    $("#rss").text("mem: " + megabytes.toString() + " megs");
  }
}

//used to keep the most recent messages visible
function scrollDown () {
  window.scrollBy(0, 100000000000000000);
  $("#buildInfo").focus();
}

function completedBuild(code) {
  if (code === "false" ) {
    $("#result").html("<h1 id=buildResult> Failed! </h1>").css('background-color','red');
  }
  else {
    $("#result").html("<h1 id=buildResult>Passed! </h1>").css('background-color','green');;
  }

  $("#result").show();
  scrollDown();
};

function updateLog(message) {
  message = message.replace(/\n/, "<br />");
  $("#buildInfo").append(message);
  scrollDown();  
};


$(document).ready(function() {
  $("#buildInfo").val("clear");

  $(".button").click( function () {
    jQuery.facebox({div: '#usage'});
  });

  $("#build").click(function () {
    var gitUrl = $("#git").val();

    if (!gitUrl) {
      alert("Please enter a git url");
      $(".git").focus();
      return;
    }

    $("#result").hide();
    $("#buildInfo").empty();
    var socket = new io.Socket(null, {port: 3000}); 
    socket.connect();
    socket.on('connect', function(){ 
      socket.send({gitUrl: gitUrl, srcBuilder: $("#srcBuilder").val() ,buildCmd : $("#buildCmd").val()});

    }); 
    socket.on('message', function (data) { 

      if (data) {
        if (data.rss) {
          updateRSS(data.rss);
        }
        if (data.message) {
          updateLog(data.message);
        }

        if(data.result) {
          completedBuild(data.result);
          socket.disconnect();
        }
      }

    });

    socket.on('disconnect', function(){ }) 

  });
});
