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

// Optionally disable intercom default shortcuts
chrome.storage.sync.get({disable_shortcuts: true}, function(data){
	if(data.disable_shortcuts && (location.host === "app.intercom.io" ||  location.host == "app.intercom.com")){
		$("body").append(
			`<script>
				// Catch all keypresses - If the keypress doesn't include the CTRL or CMD key, 
				// and the user is not focusing on an input filed, then prevent default behavior. 
				window.document.body.onkeydown = function() {
			        if (!event.ctrlKey && !event.metaKey &&  !($(".composer-inbox").is(':focus') || $('input').is(':focus') 
			        	|| $('textarea').is(':focus') || $('div[contenteditable=true').is(':focus'))) {
			            event.stopPropagation();
			            event.preventDefault();
			        }
			        return true;
			    }
			 </script>`
		);
	}
})


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

// Show announcement on install or version update 
chrome.runtime.sendMessage({message: "show-message"}, (response) => {
	if(response.show){
		let thisVersion = chrome.runtime.getManifest().version;
		if(response.reason === "install"){
			// first install, show tips
			$utils.announcement(`
				<p>Hi! Thanks for installing the Advisor Toolbox extension. Your life is about to get so much easier!</p>
				<br/>
				<h3>Here are some tips to help you get started:</h3>
				<ul>
					<li>Make sure you set your name and number of seconds in the fields in the <a href="${chrome.extension.getURL("ui/options.html")}">
					options page</a>. Confirm that your name matches (including casing) the one listed in the <a style="display:inline;" 
					href="https://docs.google.com/a/codecademy.com/forms/d/e/1FAIpQLSdf8UJxP5m3eHoVKY1ufhRffOZr2ul5ExrJxKFXw3Qzeyw-cg/viewform"
					>post-interaction report form</a>
					</li>
					<li>Read through the <a href="${chrome.extension.getURL("ui/options.html")}">usage guide</a> to learn more about how 
					to make the most of this extension</li>
				</ul>
				<p>Happy advising!</p>
				`);
		}else if(response.reason === "update"){

			// Show an announcement on update
			if(thisVersion === "1.3.0" /* change this to show for specific version */){
				$utils.announcement(`
					<h2>Panda has updated!</h2>
					<br />
					<p>What's new?</p>
					<p>The extension's clock in/out function has been updated to use When I Work</p>
					<p>Update for the invoice generator is coming soon...</p>
					<br>
					
					<p>Additionally, the extension will now attempt to figure out, and check the conversation type checkboxes based on 
					the final note left in the conversation.</p>
					<br>

					<p>If you find a problem with the extension, feel free to
					<a href="https://bitbucket.org/walom8868/codecademy-advisortoolbox/issues?status=new&status=open"> create an issue on BitBucket</a>.</p><br />

					<p>Happy advising!</p>

				`);
			}
		}
	}
});