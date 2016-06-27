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

// Disable intercom default shortcuts
$("body").append(
	`<script>
		$(document).off("keydown");
	 </script>`
);

// Create new shortcuts for these 2 things
$utils.createKeyboardShortcut(unassign_and_close, "U");
$utils.createKeyboardShortcut(ratings_url, "R");

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