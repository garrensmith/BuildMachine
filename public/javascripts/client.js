
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
  alert('code' + code);
  if (code === 1) {
    $("#result").html("Failed!").css('background-color','red');
  }
  else {
    $("#result").html("Passed!");
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
      socket.send({gitUrl: gitUrl, builder: $("#builder") ,buildCmd : $("#buildCmd").val()});

    }); 
    socket.on('message', function (data) { 

      if (data) {
        if (data.rss) {
          updateRSS(data.rss);
        }
        if (data.message) {
          updateLog(data.message);
        }

        if(data.code) {
          completedBuild(data.code);
          socket.disconnect();
        }
      }

    });

    socket.on('disconnect', function(){ }) 

  });
});
