import $intercom from 'core/intercom/content/intercom'
import $utils from 'core/utils/content/utils'

function ratings_url() {
	chrome.runtime.sendMessage({
		message: "url_rating",
		convoURL: document.URL
	});
}

function unassign_and_close() {
	$("div[data-content='Assign to teammate or team']").click();
	$("div.js__admin-list-item div")[1].click();
	$("button.js__conversation-header__close-button").click();
}

function submit_and_close() {
	$("#open-report").click();
	$("#close-side-panel").click();
}

// speed addict
function submit_close_unassign() {
	$("#open-report").click();
	$("#close-side-panel").click();
	$("div[data-content='Assign to teammate or team']").click();
	$("div.js__admin-list-item div")[1].click();
	$("button.js__conversation-header__close-button").click();
}

// Disable intercom default shortcuts
$("body").append(
	`<script>
		$(document).off("keydown");
	 </script>`
);

// Create new shortcuts for these 2 things
$utils.createKeyboardShortcut(unassign_and_close, "U");
$utils.createKeyboardShortcut(ratings_url, "R");
$utils.createKeyboardShortcut(submit_and_close, "S");
$utils.createKeyboardShortcut(submit_close_unassign, "X");

// Add listener to put URL in the convo
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.message == "got_rating_url") {
	   console.log("Received rating url: " + request.ratingURL);
	   $("div.tabs__discrete-tab__container a:first").click();
	   $(".conversation__text.composer-inbox p").text(request.ratingURL);
	   $(".conversation__text.composer-inbox p").select();
	   $("button.inbox__conversation-controls__button.o__primary").click();
	}
});


// No need to add the buttons for these functions anymore, shortcuts make everything simpler

// Add this release announcement
// Remember to update the version to show only once this message (it's important)
$utils.announcement(`
	<p>Hey there! This is Roberto (Arias-Yacupoma) again, another announcement:</p><br />
	<p>In the previous announcement I mentioned that I'll be leaving some day within next month.
	   Well, that day is this Saturday July 2nd. That means no more support for the extension from my side :)</p><br />
	<p>The code for this extension is in <a target="_blank" href="https://bitbucket.org/walom8868/codecademy-advisortoolbox/overview"> this bitbucket repo </a>.
	   Check the README, there are the instructions on how to build, load in Chrome and how to publish to Chrome Store, and
	   there's also a full documentation of the code structure and what each file is/does</p><br />
	<p>I'll stay around in the chat for a few more weeks until i slowly fade into the dark and leave :P
	   If you want guidance or help understanding how the panda thing works, DM me in slack.
	   If you want to officially support the extension and take it over, let me know to pass it to you
	   (because this is still under my developer account in Chrome Store) </p><br />
	<p>Anyway, great talking with you guys (online, but still... a few i got to meet in person though) and see ya'll</p><br />

`, "1.1.1")
