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

function unassign() {
	$(".js__assignment-admin-dropdown .ds-new__dropdown__opener").click();
	setTimeout(() => {
		const index = $('.ds-new__dropdown__block__item .assignee-selector__assignee-name:contains("Unassigned")').index();
		if(index !== -1){
			$('.ds-new__dropdown__block__item .assignee-selector__assignee-name:contains("Unassigned")')[index].click();
		}
	}, 500);	
}

function unassign_and_close() {
	$(".js__assignment-admin-dropdown .ds-new__dropdown__opener").click();
	setTimeout(() => {
		const index = $('.ds-new__dropdown__block__item .assignee-selector__assignee-name:contains("Unassigned")').index();
		if(index !== -1){
			$('.ds-new__dropdown__block__item .assignee-selector__assignee-name:contains("Unassigned")')[index].click();
			$('div[data-content="Close conversation"]').find('.btn.o__secondary').click();
		}
	}, 500);	
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
		unassign_and_close();
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
$utils.createKeyboardShortcut(ratings_url, "R");
$utils.createKeyboardShortcut(unassign, "M");
$utils.createKeyboardShortcut(unassign_and_close, "U");
$utils.createKeyboardShortcut(submit_press, "L");
$utils.createKeyboardShortcut(submit_unassign_close, "X");

// Add listener to put URL in the convo
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	if (request.message == "got_rating_url") {
	  	// console.log("Received rating url: " + request.ratingURL);
	  	let $textbox = $('.composer-box .composer-inbox');
		$("div.tabs__discrete-tab__container a:first").click();
		let prev_text =  $textbox.find("p").html();
		if(prev_text.trim().replace(/\u200b/g, '').length > 0)
			prev_text =  prev_text + '<br>';
		else
			prev_text = "";
		$textbox.find("p").empty().html(prev_text + request.ratingURL);
		$textbox.find("p").select();
		// Automatically send URL
		$textbox.focus();
		setTimeout(function(){ 
			$("button.btn.o__primary.ember-view")[0].click()
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
			if(thisVersion === "1.3.4" /* change this to show for specific version */){
				$utils.announcement(`
					<h2>Panda has updated!</h2>
					<br />
					<p>The invoice generator and clock in/out functions now use When I Work!</p>
					<br>
					<p>To generate an invoice:</p>
					<ol>
						<li>Make sure you're logged in to <a href="https://codecademy.wheniwork.com/">When I Work</a>.</li>
						<li>Fill in your name, email, and address in the <a href="${chrome.extension.getURL("ui/options.html")}">options page</a>.
							(Not required, but makes invoice generation easier)</li>
						<li>Click "Create Invoice" in the extension popup. This will navigate to When I Work, generate an invoice, and then
							prompt you to download it</li>
					</ol>
					<p><strong>For mentors / Project review people:</strong> If you do project review or are a mentor, and need to also generate invoices 
						from Tracksmart records, check the "I am also a mentor / do project review" button in the 
						<a href="${chrome.extension.getURL("ui/options.html")}">options page</a>.
					</p>
					<br>

					<p>If you find a problem with the extension, feel free to
					<a href="https://bitbucket.org/walom8868/codecademy-advisortoolbox/issues?status=new&status=open"> create an issue on BitBucket</a>.</p><br />

					<p>Happy advising!</p>

				`);
			}
		}
	}
});