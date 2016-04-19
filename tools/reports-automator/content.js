var count = 0;

var INTERCOM_URL_PREFIX = "https://app.intercom.io";

/** Selectors from intercom chat website **/
var chatSelector = ".conversation__inbox__list-wrapper";
var chatItemSelector = ".conversation__list__item";
var userLastVisitedLinkSelector = ".test__page-activity-link";


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

	/** Get the conversation URL, gotta use the last # as this interaction's ID */
	// An interaction is the user-chat combination we have today
	var conversationURL = $(this).attr("href");
	var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

	// Check if we already have something in memory for this interaction
	if (interactions[interactionID] == undefined) {
		// Start up this object
		interactions[interactionID] = {};
	}

    // Get user's name
    var userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    var userNameLeftBox = this.querySelector(".avatar__container h3").innerHTML.trim();


    /*  Add user's name and conversation URL to our collected data object */
    interactions[interactionID]["Name"] = userNameLeftBox;
    interactions[interactionID]["conversationURL"] = INTERCOM_URL_PREFIX + conversationURL;


    // Need to wait until the right chat is loaded in screen
    // To do this, compare the user's name from the chat panel (the one that we're waiting for to load)...
    // ... vs user's name on the left chat panel (the one that is already loaded and we can use as reference)
    var interval = setInterval(function() {
    	if (userNameHeader != userNameLeftBox) {
    		userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    	}
    	else {
    		// Once reached this point, chat is properly loaded in screen. No need to keep the loop alive
    		clearInterval(interval);

    		/**** Get summary from the chat  *****/

		    // Get the last note which might be our Summary of interaction
		  	var possibleSummaryElement = $(".conversation__part .o__admin-note .conversation__text p").last();
		  	if (possibleSummaryElement.length != 0)
		  		var possibleSummary = possibleSummaryElement.html().split(":");
		  	else
		  		var possibleSummary = [];

		  	// Get the summary text from our previous last note/possible summary note
		  	if (possibleSummary[1] != undefined && (possibleSummary[0].toLowerCase() == "summary"
		  		|| possibleSummary[0].toLowerCase() == "s"))
		  		var summary = possibleSummary[1].trim();
		  	else
		  		var summary = "";

		  	// Add the summary to our panel
		  	interactions[interactionID]["summary"] = summary;


		  	/** Get report's course from the user's information panel (the one at the right of the chat)
		  	 *  This field might not be correct 100% of the time,
		  	 *  because link used here only shows the last visited page by user, and user might have go to a different course
		  	 *  But, it's worth the try, and if it's wrong for the report then advisor will notice and fix it
		  	 */

		  	// TODO: Move this logic to a separate function
		  	var lastVisitedLinkURL = $(userLastVisitedLinkSelector).attr("href");
		  	console.log("Retrieved last visited link: " + lastVisitedLinkURL);

			// Compare against pre-defined courses values in URL (check form.js)
			for (key in COURSES) {
				if (lastVisitedLinkURL.indexOf(COURSES[key]) > -1) {
					console.log("Found the course " + key);
					interactions[interactionID]["course"] = key;
					break;
				}
			}

		  	// Finally, render the panel. Do it at the end so all collected info is displayed
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


// If we're disabling it, unbind listeners
openOrCloseReports = function() {

	if ($(chatSelector).length == 0) {
		$.notify("You are not in your inbox page!", {
			className: "info",
			globalPosition: "top center"
		});
		return;
	}

	// Toggle the status of the extension
	isRunning = !isRunning;

	// Enable or disable reports
	if (isRunning) {
		// When a chat tab is clicked...
		$(".app__wrapper").on("click", `${chatSelector} ${chatItemSelector}`, dataCollector);
		$(chatSelector + " " + chatItemSelector + ".o__active").click();

		// Alert that report mode is ON
		$.notify("Reports enabled!", {
			className: "info",
			globalPosition: "top center"
		});
	} else {
		document.getElementById("side-panel").innerHTML = "";
		$(".app__wrapper").unbind("click", dataCollector);			

		// Alert reports disabled
		$.notify("Reports disabled!", {
			className: "info",
			globalPosition: "top center"
		});
	}
}

$("body").append(
	`<script>
		$(window).keydown(function(event) {

		  // Shortcut for Open/Close reports automator
		  if(event.ctrlKey && event.shiftKey && event.keyCode == 79) { 
		    console.log("Hey! Ctrl+Shift+O event captured!");
		    openOrCloseReports();
		    event.preventDefault();
		    event.stopPropagation();
		  }
		});
	 </script>`
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "start-stop" ) {
		openOrCloseReports();
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

	// URL rating
	else if (request.message == "got_rating_url") {
		console.log("Received rating url: " + request.ratingURL);
		$(".conversation__text.composer-inbox p").text(request.ratingURL);
	}
  }
);
