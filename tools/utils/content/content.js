import $intercom from 'core/intercom/content/intercom'
import $utils from 'core/utils/content/utils'

function ratings_url() {
	// Temporary fix. Switch .com to .io till intercom gets their act together
	let domain = "https://app.intercom.io" + document.location.pathname;
	chrome.runtime.sendMessage({
		message: "url_rating",
		convoURL: domain
	});
}

function unassign_and_close() {
	$("div[data-content='Assign to teammate or team']").click();
	if($("div.js__admin-list-item div span").first().text().indexOf("Nobody") !== -1)
		$("div.js__admin-list-item div")[1].click();
	else 
		$("div[data-content='Assign to teammate or team']").click();
	$("button.js__conversation-header__close-button").click();
}

function submit_press() {
	$("#open-report").click();
}

// speed addict
function submit_unassign_close() {
	$("#open-report").click();
	// Check if the report is ready to be filed
	if($("#data").attr("data-can-file") === "true"){
		$("#close-side-panel").click();
		$("div[data-content='Assign to teammate or team']").click();
		$("div.js__admin-list-item div")[1].click();
		$("button.js__conversation-header__close-button").click();
	}

}

// Disable intercom default shortcuts
$("body").append(
	`<script>
		// Catch all keypresses - If the keypress doesn't include the CTRL key, 
		// and the user is not focusing on an input filed, then prevent default behavior. 
		window.document.body.onkeydown = function() {
	        if (!event.ctrlKey && !($(".composer-inbox").is(':focus') || $('input').is(':focus') || $('textarea').is(':focus'))) {
	            event.stopPropagation();
	            event.preventDefault();
	        }
	        return true;
	    }
	 </script>`
);

// Create shortcuts
$utils.createKeyboardShortcut(unassign_and_close, "U");
$utils.createKeyboardShortcut(ratings_url, "R");
$utils.createKeyboardShortcut(submit_press, "S");
$utils.createKeyboardShortcut(submit_unassign_close, "X");

// Add listener to put URL in the convo
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.message == "got_rating_url") {
	   console.log("Received rating url: " + request.ratingURL);
	   $("div.tabs__discrete-tab__container a:first").click();
	   $(".conversation__text.composer-inbox p").text(request.ratingURL);
	   $(".conversation__text.composer-inbox p").select();
	   // Automatically send URL
	   $(".conversation__text.composer-inbox").focus();
	   setTimeout(function(){ 
	   	$("button.btn.o__primary.o__in-right-list").click();
	   }, 500);
	}
});

// Release announcement
// Remember to update the version to only show this message once
$utils.announcement(`
	<p>Hi! This is Adam N (@adam) with an announcement:</p><br />
	<p>Just wanted to officially mention that Elise(@elise9876) now owns the extension and I've been making
	 some changes to it here and there. There are two new shortcuts:</p><br />
	<p><strong>Ctrl + Shift + X</strong> will submit the report, close the panel, unassign convo, and close the convo.<br>
	<strong>Ctrl + Shift + S</strong> will just submit the report. Use this or manually press the submit button
	when not using Ctrl + Shift + X.
</p><br />
	<p>If you find a problem with the extension, feel free to
	<a href="https://bitbucket.org/walom8868/codecademy-advisortoolbox/issues?status=new&status=open"> create an issue on BitBucket</a> or DM me on slack.</p><br />

`, "1.1.4")
