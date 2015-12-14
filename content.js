var count = 0;

/** Selectors from intercom chat website **/
var chatSelector = ".conversation__inbox__list-wrapper";
var chatItemSelector = ".conversation__list__item";

/**
 *  Wait until something is loaded and ready to use it
 */
function executeWhenReady(executeThisFunction, condition, expectedValue, delay) {
	var internalInterval = setInterval(function() {
		if (condition != expectedValue) {
			console.log("Condition: " + condition + " - Expected value: " + expectedValue);
		}
		else {
			clearInterval(internalInterval);
			executeThisFunction();
		}
	}, delay);
}

/**
 *  Take the conversation URL and send it to background
 */
function myFunction() {
	console.log("called myFunction");
	var conversationURL = $(this).attr("href");

    // Get user's name
    var userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    var userNameLeftBox = $(chatItemSelector + '.o__active').find(".avatar__container h3").html().trim();

    var interval = setInterval(function() {
    	if (userNameHeader != userNameLeftBox) {
    		// Wait until the chat has loaded
    		alert(userNameHeader);

    		userNameHeader = (chatItemSelector + '.o__active').find(".avatar__container h3").html().trim();
    	}
    	else {
    		clearInterval(interval);

		    // Get the summary from the last note
		  	var possibleSummary = $(".conversation__part .o__admin-note .conversation__text p").last().html().split(": ");
		  	var summary = "";

		  	if (possibleSummary[1] != undefined && possibleSummary[0].toLowerCase() == "summary") {
		  		summary = possibleSummary[1].trim();
		  	}

			console.log(summary);

		    // Send the data to the report filler
			chrome.runtime.sendMessage({
				"message": "open_report_tab",
				"conversationURL": conversationURL,
				"summary": summary
			});	
    	}
    }, 1000);

  	// Get the duration of this chat
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "start" ) {
    	console.log("Reporter");

		if (request.enabled == "true") {
		    
			console.log("Starting up...");

		   	// When a chat tab is clicked...
			$(chatSelector).on("click", chatItemSelector, myFunction);
		}

		// If we're disabling it, unbind listeners
		else {
			$(chatSelector).unbind("click", myFunction);
			console.log("Disabling it");
		}
	}
  }
);

      /*$("body").append(
			`<script> alert('Testing script'); </script>`
		);*/