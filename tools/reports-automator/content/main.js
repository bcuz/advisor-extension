import $intercom from 'core/intercom/content/intercom'
import $notifications from 'core/notifications/content/notifications'
import $utils from 'core/utils/content/utils'

var count = 0;

/** Keep in memory the ID's of all successfully filed reports for this shift **/
// This will be used later to check for duplicate reports
let success_list = {};

// Set the state of the extension in this tab
var isRunning = false;

/**
 *  Take the data we'll use
 */
function collectDataAndOpenReport() {

	/** Get the conversation URL, gotta use the last # as this interaction's ID */
	// An interaction is the user-chat combination we have today
	var conversationURL = $intercom.getConversationURL();
	var interactionID = conversationURL.substring(conversationURL.lastIndexOf("/")+1);

	// the data for this interaction
	let interaction = {};

	// Check if we already filed a successful report for this interaction
	if(success_list[interactionID] !== undefined)
		interaction["success"] = true;
	
	// Get the clicked item
	var clickedItem = $(this);

    // Get user's name
    var userNameHeader = $intercom.getUserNameHeader();
    var userNameLeftBox = $intercom.getUserNameClickedChatItem(clickedItem);


    /*  Add user's name and conversation URL to our collected data object */
    interaction["Name"] = userNameLeftBox;
    interaction["conversationURL"] = conversationURL;

    // Need to use this variable to correctly get data when the chat loads using executeWhenReady
    var collectFromChat = {
    	executeThisFunction: function() {
	    	/**** Get summary from the chat  *****/
	    	var possibleNoteElement = $intercom.getLatestInternalNote();

		    // Get the last note which might be our Summary of interaction
		  	if (possibleNoteElement.length != 0)
		  		var possibleOther = possibleNoteElement.html().split(/[;\:]/);
		  	else
		  		var possibleOther = [];

		  	// clean up the text
		  	for(var i in possibleOther){
		  		possibleOther[i] = possibleOther[i].trim();
		  	}

		  	var mins = null, hours = null, other = null;
		  	// Get the minutes, hours, and other text from the last note
		  	if (possibleOther.length > 1){
			  	for(var i = 0; i < possibleOther.length; i++){
			  		if(possibleOther[i].toLowerCase() == 'o'){
			  			other = possibleOther[i+1];
			  		}else if(possibleOther[i].toLowerCase() == 'm'){
			  			mins = possibleOther[i+1];
			  		}else if(possibleOther[i].toLowerCase() == 'h'){
			  			hours = possibleOther[i+1];
			  		}
			  	}
		  	}
		  	if(!other)
		  		other = "";

		  	// Add the other to our panel
		  	interaction["other"] = other;

		  	// If the duration is not in the last note, try to automatically calculate it.
		  	if(!mins && !hours){
		  		// get the last time the convo was reassigned
				var possibleDuration = $intercom.getLastReassignedTime();
				// try to calculate conversation duration
				if(possibleDuration !== undefined && possibleDuration !== null){
					var time = new Date(possibleDuration), time2 = new Date();
					var difference = time2.getTime() - time.getTime();
					mins = ((difference / (1000*60)) %60).toFixed();
					hours = Math.floor(((difference / (1000*60*60)) %24));
					console.log("Got the convo duration: " + hours + " hours, " + mins + " minutes.");
				}
		  	}

		  	// add minutes to panel
		  	interaction["minutes"] = mins || 0;
		  	// add hours to the panel
		  	interaction["hours"] = hours || 0;
		  	

		  	/** Get report's course from the user's information panel (the one at the right of the chat)
		  	 *  This field might not be correct 100% of the time,
		  	 *  because link used here only shows the last visited page by user, and user might have go to a different course
		  	 *  But, it's worth the try, and if it's wrong for the report then advisor will notice and fix it
		  	 */

		  	var lastVisitedLinkURL = $intercom.getUserLastVisitedLink();
		  	console.log("Retrieved last visited link: " + lastVisitedLinkURL);

			// Compare against pre-defined courses values in URL (check new_form.js)
			var foundCourse = false;
			for (key in COURSES) {
				if (!foundCourse) {
					for (course_id in COURSES[key]) {
						if (lastVisitedLinkURL !== undefined && lastVisitedLinkURL.indexOf(COURSES[key][course_id]) > -1) {
							console.log("course_id is " + course_id + " and " + COURSES[key][course_id]);
							console.log("Found the course " + key);
							interaction["course"] = key;
							foundCourse = true;
							break;
						}
					}
				}
				else
					break;
			}

			// Default to "PLEASE SELECT" if course wasn't found
			if(!foundCourse)
				interaction["course"] = "PLEASE SELECT";

			// Auto-check "This was about ready material"
			let is_ready_convo = false;
			if(lastVisitedLinkURL !== undefined)
				is_ready_convo = lastVisitedLinkURL.includes('freelance') || lastVisitedLinkURL.includes('programs');

			if(is_ready_convo && !foundCourse)
				interaction["course"] = "HTML/CSS";

			// Try to determine the type of conversation from the note
		  	// and use this to check the corresponding checkboxes
		  	let pne = possibleNoteElement.text().toLowerCase();
		  	let to_check = {
		  		'syntax': pne.includes('syntax'), 
		  		'concept': pne.includes('concept'),
		  		'onboard': pne.includes('onboard') || pne.includes('obd'),
		  		'ready': is_ready_convo,
		  		'other': other.length > 0,
		  		'bug': pne.includes('bug report'),
		  		'personal': pne.includes('personal project') || pne.includes('off platform') || pne.includes('off-platfrom')
		  					|| pne.includes('outside project')
		  	}
		  	interaction["to_check"] = to_check;

			// Finally, render the panel. Do it at the end so all collected info is displayed
			side_panel.render(interaction);
	    },

	    condition: userNameHeader,
	    expectedValue: userNameLeftBox,
	    updateCondition: function(toUpdate) {
	    	toUpdate.condition = $intercom.getUserNameHeader();
	    	console.log("User in header updated to: " + userNameHeader);
	    },
	    delay: 100
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
	
	// Warn and return if there are no conversations
	if($(".empty-state").length !== 0 && !isRunning){
		$notifications.info("There are no conversations in this inbox");
		return;
	}

	// Toggle the status of the extension
	isRunning = !isRunning;

	// Enable or disable reports
	if (isRunning) {
		// When a chat tab is clicked, run data collector
		$($intercom.UI_selectors.app).on("click",
			`${$intercom.UI_selectors.chat} ${$intercom.UI_selectors.chatItem}`, collectDataAndOpenReport);

		// Click the active tab to open
		$intercom.getActiveChatItem().click();

		// Alert that report mode is ON
		$notifications.info("Report panel open!");

	} else {
		// Remove data collector function
		$($intercom.UI_selectors.app).unbind("click", collectDataAndOpenReport);
		// hide the panel
		side_panel.hide_panel();
	}
}

// Create shortcut for this tool
$utils.createKeyboardShortcut(toggleReport, "O");

// Set listeners for this tool
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    switch(request.message) {
    	case "start-stop":
   			toggleReport();
   			break;

		case "filling_failed":
			$notifications.failure("Failed report for: " + request.userName);
			break;

		case "filling_success":
			$notifications.success("Success report for: " + request.userName);
			// Update our list of successes
			success_list[request.interactionID] = true;
			break;

		// Do nothing on default
		default:
			break;
	}
});
