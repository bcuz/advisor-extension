var count = 0;

/** Selectors from intercom chat website **/
var chatSelector = ".conversation__inbox__list-wrapper";
var chatItemSelector = ".conversation__list__item";


/** Keep in memory data for all the users we'll have in this shift **/
// This will be used later... during data collection
interactions = {};

// Set the state of the extension in this tab
var isRunning = false;


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
 *  Take data from the chat and send it to the background
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
		console.log("interactions #: " + interactionID + " doesn't exists yet");
		interactions[interactionID] = {};
		console.log(JSON.stringify(interactions));
	}
	else {
		console.log("Printing interactions...");
		console.log(JSON.stringify(interactions));
	}

    // Get user's name
    var userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    var userNameLeftBox = this.querySelector(".avatar__container h3").innerHTML.trim();

    // Add name to the state object
    interactions[interactionID]["Name"] = userNameLeftBox;
    interactions[interactionID]["conversationURL"] = conversationURL;

    var interval = setInterval(function() {
    	if (userNameHeader != userNameLeftBox) {
    		// Wait until the chat has loaded
    		console.log(userNameHeader);

    		userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    	}
    	else {
    		clearInterval(interval);

		    // Get the summary from the last note
		  	var possibleSummaryElement = $(".conversation__part .o__admin-note .conversation__text p").last();
		  	if (possibleSummaryElement.length != 0)
		  		var possibleSummary = possibleSummaryElement.html().split(": ");
		  	else
		  		var possibleSummary = [];

		  	if (possibleSummary[1] != undefined && possibleSummary[0].toLowerCase() == "summary")
		  		var summary = possibleSummary[1].trim();	
		  	else
		  		var summary = "";

		  	interactions[interactionID]["summary"] = summary;
			console.log("Summary: " + summary);

			side_panel.render(interactions[interactionID]);
    	}
    }, 500);

  	// Get the duration of this chat
}

function success(message) {
	$.notify(message, {
		className: "success",
		globalPosition: "top center",
		hideAnimation: "slideUp",
		autoHide: true,
		autoHideDelay: 5000
	});
}

function failure(message) {
	$.notify(message, {
		className: "error",
		globalPosition: "top center",
		hideAnimation: "slideUp",
		clickToHide: true,
		autoHide: false
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "start-stop" ) {
    	console.log("Reporter");

    	if ($(chatSelector).length == 0) {
			$.notify("You are not in your inbox page!", {
				className: "info",
				globalPosition: "top center"
			});
			return;
		}

    	// Toggle the status of the extension
    	isRunning = !isRunning;
    	console.log("Extension running now");

    	// Start it up or shut it down
		if (isRunning) {
		    
			console.log("Starting up...");

		   	// When a chat tab is clicked...
			$(".app__wrapper").on("click", `${chatSelector} ${chatItemSelector}`, dataCollector);

			// Alert that report mode is ON
			$.notify("Reports enabled!", {
				className: "info",
				globalPosition: "top center"
			});
		}

		// If we're disabling it, unbind listeners
		else {
			$(".app__wrapper").unbind("click", dataCollector);
			console.log("Disabling it");

			// Alert reports disabled
			$.notify("Reports disabled!", {
				className: "info",
				globalPosition: "top center"
			});
		}
	}

	else if (request.message == "filling_failed") {
		// Show notification about it
		failure("Failed report for: " + request.userName);
	}

	else if (request.message == "filling_success") {
		// Show notification about it
		success("Success report for: " + request.userName);

		// Update our list of success
		interactions[request.interactionID]["success"] = true;
	}
  }
);