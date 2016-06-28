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

// Add this release announcement
// Remember to update the version to show only once this message (it's important)
/*$utils.announcement(`
	<p>Hey there! This is Roberto, just wanted to let you know about a few important things. 
	   You'll see this message only once.</p><br />
	<p>First, thanks for trusting part your work to the code i once wrote on a drunk night at 3am, maybe the one who wrote your car drivers
	   did it in the same state as me, now you know how brave you are :D!</p><br />
	<p>Now more seriously, this kind of popup announcement will be used from now on for every new features or important stuff to communicate</p><br />
	<p>I'll be leaving this position sometime within the next month, so someone should pick up this extension's code 
	   or it'll be lost forever (i don't mind if it turns out like that, it helped me while i was here so i'm happy)</p></br />
	<p>Adam N. has been helping with fixes to various issues, and Saad originally wrote the invoice generator,
	   If any of you guys wanna take this over or somebody else, message me up (@roberto)</p><br />
	<p>Also, currently there are 3 keyboard shortcuts (in case you didn't know):</p>
	<ul>
	<li> Ctrl + Shift + O  -  Open/Close Report panel </li>
	<li> Ctrl + Shift + R  -  Generate rating URL </li>
	<li> Ctrl + Shift + U  -  Unassign & Close </li>
	</ul>
	<p> Also you can use your last note from a conversation as the summary for its report.
	    Just make sure the last internal note starts with "s: ", as in:
	    "s: description that will be filled in the summary" </p><br />

`, "1.1.0")*/