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