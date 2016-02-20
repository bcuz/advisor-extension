chrome.runtime.sendMessage({
	message: 'need_rating_url'
}, function (response) {
	var input = document.querySelector("input[name=conversation-url]");

	input.value = response.convoURL;
	
	var event = document.createEvent("HTMLEvents")
	event.initEvent("input", true, true)
	input.dispatchEvent(event)

	$("button")[0].click();


	// Get the response, pass it to the background again
	var ratingURL = $("input[name=survey-url]").val();
	console.log("rating url here: " + ratingURL);
    var interval = setInterval(function() {
    	if (ratingURL == "") {
    		console.log("rating url was empty....");
    		ratingURL = $("input[name=survey-url]").val();
    	}
    	else {
    		console.log("rating url not empty: " + ratingURL);
    		// Once reached this point, chat is properly loaded in screen. No need to keep the loop alive
    		clearInterval(interval);


			chrome.runtime.sendMessage({
				message: 'got_rating_url',
				ratingURL: ratingURL
			});
			console.log("Send ratingURL to background");
		}
	}, 500);
});