document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', function() {
      // Send a message to background with the id of the clicked option
      chrome.runtime.sendMessage({
        "message": "popup",
        "id": $(this).attr("id")
      });

      // Close popup after message is sent
      window.close();
    });
  }
});

$(document).ready(function(){
  let userData = null;
  let working = null;
  // whenever the use opens up the popup, check if they're clocked in or not and perform actions accordingly.
  chrome.runtime.sendMessage({message: "get-user-data"}, function(response){
    if(response !== null && response !== undefined){
      userData = response.data;
      working = userData.working;
    }else{
      working = false;
    }

    if(!working){
      clockedOut();
    }else if(working){
      workingNow();
    }
  })

  // handles clock in / clock out button click.
  $('#clock-in-out').click(function(){
    if($(this).hasClass('start')){
      chrome.runtime.sendMessage({message: "clock-user-in"});
      workingNow();
    }else if($(this).hasClass('stop')){
      clockedOut();
      chrome.runtime.sendMessage({message: "clock-user-out"});
    }
  });

  // updates the ui after clocking in.
  function workingNow(){
    $('#clock-in-out').removeClass('start')
    $('#clock-in-out').addClass('stop');
    $('#clock-in-out h1').text('Clock Out');
    //$('.shiftNumbers').show();
    //$('.totalThisShift').text(bgPage.userData.closedThisShift);
  }

  // calculate how long the user has been clocked in
  // function calcDuration(){
  //   var time2 = moment();
  //   var timeDiff = time2.diff(bgPage.userData.clockInTime);
  //   var duration = moment.duration(timeDiff);
  //   hoursThisShift = duration;
  //   var hours = duration.hours(), mins = duration.minutes(), secs = duration.seconds();
  //   return hours + " hours, " + mins + " minutes, and " + secs + " seconds";
  // }

  // calculate the average number of conversations closed per hour
  // function calcAverage(shiftOrAll){
  //   if(shiftOrAll == "shift"){
  //     var total = bgPage.userData.closedThisShift;
  //     if(hoursThisShift.asHours() > 1){
  //       var avgThisShift = total / hoursThisShift.asHours();
  //     }else{
  //       var avgThisShift = total;
  //     }
  //     return avgThisShift.toFixed(2);
  //   }else if(shiftOrAll == "all"){
  //     if(bgPage.userData.totalHours > 1)
  //       return (bgPage.userData.totalClosedConvos / bgPage.userData.totalHours).toFixed(2);
  //     else
  //       return bgPage.userData.totalClosedConvos;
  //   }
  // }

  // when the user is clocked out, modify the ui
  function clockedOut(){
    //$('.hourCounter h3').text("You're not currently working");
    $('#clock-in-out').addClass('start');
    $('#clock-in-out h1').text("Clock In");
    //$('.shiftNumbers').hide();
  }

  // after clocking out show stats
  // function showReport(){
  //   // add the hours worked this shift to the totalHours count
  //   bgPage.userData.totalHours += hoursThisShift.asHours();
  //   // show numbers for this shift
  //   $('.hourCounter h3').text("You worked " + hoursThisShift.asHours().toFixed(2) + " hours " +
  //     "and closed " + bgPage.userData.closedThisShift + " conversations, for an average of " + calcAverage("shift") +
  //     " conversations per hour");
  // }

  // show all time convo info
  // var allTimeAvg = calcAverage("all");
  // $('.averageAllTime').text( allTimeAvg + " /Hr")
  // $('.totalAllTime').text(bgPage.userData.totalClosedConvos);

});