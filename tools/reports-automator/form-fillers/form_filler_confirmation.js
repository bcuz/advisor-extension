thisPage = "confirmation";

// Check we find the confirmation message
if (document.querySelector(".ss-resp-message") != null && 
	document.querySelector(".ss-resp-message").innerHTML == "Thank you! ") {
	// YEEEEEEAAAAH BUDDY !
	chrome.runtime.sendMessage({
		"message": "report-success"
	});
	// Close the tab....
	chrome.runtime.sendMessage({
		message: 'close_tab'
	});
}
else {
	// OH SHIT NOT AGAIN
	chrome.runtime.sendMessage({
		"message": "filling_failed",
		"page": thisPage,
		"field": "N/A",
		"selector": "N/A"
	});
}