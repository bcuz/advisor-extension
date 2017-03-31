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
  let working = null;
  // whenever the use opens up the popup, check if they're clocked in or not and perform actions accordingly.
  chrome.runtime.sendMessage({message: "get-status"}, function(response){
    if(response !== null && response !== undefined){
      working = response.data;
    }else{
      working = false;
    }

    if(!working){
      clockedOut();
    }else if(working){
      clockedIn();
    }
  })

  // handles clock in / clock out button click.
  $('#clock-in-out').click(function(){
    if($(this).hasClass('start')){
      chrome.runtime.sendMessage({message: "clock-user-in"});
      clockedIn();
      $(this).removeClass('start');
    }else if($(this).hasClass('stop')){
      clockedOut();
      $(this).removeClass('stop')
      chrome.runtime.sendMessage({message: "clock-user-out"});
    }
  });

  // updates the ui after clocking in.
  function clockedIn(){
    $('#clock-in-out').addClass('stop');
    $('#clock-in-out h1').text('Clock Out');
  }

  // when the user is clocked out, modify the ui
  function clockedOut(){
    $('#clock-in-out').addClass('start');
    $('#clock-in-out h1').text("Clock In");
  }

});