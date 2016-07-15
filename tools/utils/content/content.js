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

function submit_press() {
	$("#open-report").click();
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
$utils.createKeyboardShortcut(submit_press, "S");
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
	<p>Hi! This is Adam N (@adam) with an announcement:</p><br />
	<p>Just wanted to officially mention that Elise(@elise9876) now owns the extension and I've been making
	 some changes to it here and there. There are two new shortcuts:</p><br />
	<p><strong>Ctrl + Shift + X</strong> will submit the report, close the panel, unassign convo, and close the convo.
	This is the shortcut to use if you are 100% confident that your report is going to pass.
	 Otherwise, you may have to fish it out of closed unassigned to redo the report -> don't be that guy/gal ;)<br>
	<strong>Ctrl + Shift + S</strong> will just submit the report. Use this or manually press the submit button
	when not using Ctrl + Shift + X.
</p><br />
	<p>If you find a problem with the extension, feel free to
	<a href="https://bitbucket.org/walom8868/codecademy-advisortoolbox/issues?status=new&status=open"> create an issue on BitBucket</a> or DM me on slack.</p><br />

`, "1.1.4")
