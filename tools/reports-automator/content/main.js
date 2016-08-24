import $intercom from 'core/intercom/content/intercom'
import $notifications from 'core/notifications/content/notifications'
import $utils from 'core/utils/content/utils'

var count = 0;

/** Keep in memory data for all the users we'll have in this shift **/
// This will be used later... during data collection
interactions = {};

// Set the state of the extension in this tab
var isRunning = false;

/**
 *  Take the data we'll use
 */
function collectDataAndOpenReport() {

	/** Get the conversation URL, gotta use the last # as this interaction's ID */
	// An interaction is the user-chat combination we have today
	var conversationURL = $intercom.getConversationURL();
	var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

	// Check if we already have something in memory for this interaction
	if (interactions[interactionID] == undefined) {
		// Start up this object
		interactions[interactionID] = {};
	}

	// Get the clicked item
	var clickedItem = $(this);

    // Get user's name
    var userNameHeader = $intercom.getUserNameHeader();
    var userNameLeftBox = $intercom.getUserNameClickedChatItem(clickedItem);


    /*  Add user's name and conversation URL to our collected data object */
    interactions[interactionID]["Name"] = userNameLeftBox;
    interactions[interactionID]["conversationURL"] = conversationURL;

    // Need to use this variable to correctly get data when the chat loads using executeWhenReady
    var collectFromChat = {
    	executeThisFunction: function() {

	    	/**** Get summary from the chat  *****/
	    	//var possibleSummaryElement = $intercom.getLatestInternalNote();

		    // Get the last note which might be our Summary of interaction
		  	// if (possibleSummaryElement.length != 0)
		  	// 	var possibleSummary = possibleSummaryElement.html().split(":");
		  	// else
		  	// 	var possibleSummary = [];

		  	// Get the summary text from our previous last note/possible summary note
		  	// if (possibleSummary[1] != undefined && (possibleSummary[0].toLowerCase() == "summary"
		  	// 	|| possibleSummary[0].toLowerCase() == "s"))
		  	// 	var summary = possibleSummary[1].trim();
		  	// else
		  	// 	var summary = "";

		  	// Add the summary to our panel
		  	//interactions[interactionID]["summary"] = summary;

		  	/** Get report's course from the user's information panel (the one at the right of the chat)
		  	 *  This field might not be correct 100% of the time,
		  	 *  because link used here only shows the last visited page by user, and user might have go to a different course
		  	 *  But, it's worth the try, and if it's wrong for the report then advisor will notice and fix it
		  	 */

		  	var lastVisitedLinkURL = $intercom.getUserLastVisitedLink();
		  	console.log("Retrieved last visited link: " + lastVisitedLinkURL);

			// Compare against pre-defined courses values in URL (check form.js)
			var foundCourse = false;
			for (key in COURSES) {
				if (!foundCourse) {
					for (course_id in COURSES[key]) {
						if (lastVisitedLinkURL.indexOf(COURSES[key][course_id]) > -1) {
							console.log("course_id is " + course_id + " and " + COURSES[key][course_id]);
							console.log("Found the course " + key);
							interactions[interactionID]["course"] = key;
							foundCourse = true;
							break;
						}
					}
				}
				else
					break;
			}

			// Finally, render the panel. Do it at the end so all collected info is displayed
			side_panel.render(interactions[interactionID]);
	    },

	    condition: userNameHeader,
	    expectedValue: userNameLeftBox,
	    updateCondition: function(toUpdate) {
	    	toUpdate.condition = $intercom.getUserNameHeader();
	    	console.log("User in header updated to: " + userNameHeader);
	    },
	    delay: 500
    }

    // Need to wait until the right chat is loaded in screen
    // To do this, compare the user's name from the chat panel (the one that we're waiting for to load)...
    // ... vs user's name on the left chat panel (the one that is already loaded and we can use as reference)
    $utils.executeWhenReady(collectFromChat);
}

toggleReport = function() {

	if ($($intercom.UI_selectors.chat).length == 0) {
		$notifications.info("You are not in your inbox page!");
		return;
	}

	// Toggle the status of the extension
	isRunning = !isRunning;

	// Enable or disable reports
	if (isRunning) {
		// When a chat tab is clicked, run data collector
		$($intercom.UI_selectors.app).on("click",
			`${$intercom.UI_selectors.chat} ${$intercom.UI_selectors.chatItem}`, collectDataAndOpenReport);

		console.log(`${$intercom.UI_selectors.chat} ${$intercom.UI_selectors.chatItem}`);

		// Click the active tab to open
		$intercom.getActiveChatItem().click();

		// Alert that report mode is ON
		$notifications.info("Report panel open!");

	} else {
		// Remove data collector function
		document.getElementById("side-panel").innerHTML = "";
		$($intercom.UI_selectors.app).unbind("click", collectDataAndOpenReport);

		// Alert reports disabled
		$notifications.info("Report panel closed!");
	}
}

// Create shortcut for this tool
$utils.createKeyboardShortcut(toggleReport, "O");

// Set listeners for this tool
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    switch(request.message) {
    	case "start-stop":
   			toggleReport();
   			break

		case "filling_failed":
			$notifications.failure("Failed report for: " + request.userName);
			break

		case "filling_success":
			$notifications.success("Success report for: " + request.userName);
			// Update our list of success
			interactions[request.interactionID]["success"] = true;
			break

		// Do nothing on default
		default:
			break
	}
});
