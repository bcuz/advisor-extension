chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	// URL rating
	switch(request.message) {

		case "url_rating":
			intercomTab = sender.tab.id;

			chrome.tabs.create({
				url: 'https://www.codecademy.com/advisors/survey/new',
				active: false
				}, function(tab) {
					convoURL = request.convoURL;

					chrome.tabs.executeScript(tab.id, {
						file: "deploy/form-fillers/rating_filler.js",
						runAt: "document_end"
					});
				}
			);

			break

		case "need_rating_url":
			sendResponse({
				convoURL: convoURL
			})

			break

		case "got_rating_url":
			console.log("received ratingURL: " + request.ratingURL);

			// Close the generation url tab
			chrome.tabs.remove(sender.tab.id);

			// Send the rating url back to intercom
			chrome.tabs.sendMessage(intercomTab, {
				message: 'got_rating_url',
				ratingURL: request.ratingURL
			});

			break

		default:
			break
	}
});