var userInfo = {
  lastTimestamp :(new Date()).getTime(),
};


function updateRSS () {
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
  if (code === 1) {
    $("#result").html("Failed!").css('background-color','red');
  }
  else {
    $("#result").html("Passed!");
  }
  
  $("#result").show();
}

//process updates if we have any, request updates from the server,
// and call again with response. the last part is like recursion except the call
// is being made from the response handler, and not at some point during the
// function's execution.
//
var transmission_errors = 0;
var rss = 0;

function longPoll (data) {
  if (transmission_errors > 2) {
    //showConnect();
    alert("Having an issue connectiong to the server");
    transmission_errors = 0;
    return;
  }

  if (data && data.completed) {
    completedBuild(data.code);
     scrollDown();
    return;
  }

  if (data && data.rss) {
    rss = data.rss;
    updateRSS();
  }

  if(data && data.timestamp) {
    userInfo.lastTimestamp = data.timestamp;
  }

  //process any updates we may have
  //data will be null on the first call of longPoll
  if (data && data.messages) {
    for (var i = 0; i < data.messages.length; i++) {
      var message = data.messages[i];
      message.msg = message.msg.replace(/\n/, "<br />");
      userInfo.last_message_time = message.time;
      $("#buildInfo").append(message.msg);
      scrollDown();  
      
    }
      //only after the first request for messages do we want to show who is here
    /*if (first_poll) {
      first_poll = false;
      who();
    }*/
  }
//, data: { since: CONFIG.last_message_time, id: CONFIG.id }

  //make another request
  $.ajax({ cache: false
         , type: "POST"
         , url: "/update"
         , dataType: "json"
         , data: {timestamp: userInfo.lastTimestamp} 
         , error: function () {
             //addMessage("", "long poll error. trying again...", new Date(), "error");
            transmission_errors += 1;
             //don't flood the servers on error, wait 10 seconds before retrying
             setTimeout(longPoll, 10*1000);
           }
         , success: function (data) {
             transmission_errors = 0;
             //if everything went well, begin another request immediately
             //the server will take a long time to respond
             //how long? well, it will wait until there is another message
             //and then it will return it to us and close the connection.
             //since the connection is closed when we get data, we longPoll again
             longPoll(data);
           }
         });
  
   /* $.post('/update',{timestamp: userInfo.lastTimestamp} ,function (data) {
      longPoll(data);

    }, "json"
    );*/
  
};


$(document).ready(function() {
   $("#buildInfo").val("clear");

  $("#build").click(function () {
    $("#result").hide();

    $.post('/url',{git_url: $(".git").val(), rake : $(".rake").val()} ,function () {
      longPoll();

    }, "json"
    );
  });
});
