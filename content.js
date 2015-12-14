var count = 0;

/** Selectors from intercom chat website **/
var chatSelector = ".conversation__inbox__list-wrapper";
var chatItemSelector = ".conversation__list__item";


/** Keep in memory data for all the users we'll have in this shift **/
interactions = {};


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
function dataCollector() {
	console.log("called dataCollector");

	/** Get the conversation URL, gotta use the last # as this interaction's ID */
	// An interaction is the user-chat combination we have today
	var conversationURL = $(this).attr("href");
	var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

	// Check if we already have something in memory for this interaction
	if (interactions[interactionID] == undefined) {
		// Start up this object
		interactions[interactionID] = {};
	}
	else {
		console.log("Printing interactions...");
		console.log(JSON.stringify(interactions));
	}

    // Get user's name
    var userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    var userNameLeftBox = $(chatItemSelector + '.o__active').find(".avatar__container h3").html().trim();

    // Add name to the state object
    interactions[interactionID]["Name"] = userNameLeftBox;
    interactions[interactionID]["conversationURL"] = conversationURL;

    interactions[interactionID]["myName"] = "Roberto Arias";

    var interval = setInterval(function() {
    	if (userNameHeader != userNameLeftBox) {
    		// Wait until the chat has loaded
    		console.log(userNameHeader);

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

		  	interactions[interactionID]["Summary"] = summary;
			console.log(summary);

			renderSidePanel(interactions[interactionID]);
    	}
    }, 2500);

  	// Get the duration of this chat
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "start" ) {
    	console.log("Reporter");

		if (request.enabled == "true") {
		    
			console.log("Starting up...");

		   	// When a chat tab is clicked...
			$(chatSelector).on("click", chatItemSelector, dataCollector);
		}

		// If we're disabling it, unbind listeners
		else {
			$(chatSelector).unbind("click", dataCollector);
			console.log("Disabling it");
		}
	}
  }
);

      /*$("body").append(
			`<script> alert('Testing script'); </script>`
		);*/