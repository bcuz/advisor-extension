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
			break;
		case "need_rating_url":
			sendResponse({
				convoURL: convoURL
			})
			break;
		case "got_rating_url":
			console.log("received ratingURL: " + request.ratingURL);

			// Close the generation url tab
			chrome.tabs.remove(sender.tab.id);

			// Send the rating url back to intercom
			chrome.tabs.sendMessage(intercomTab, {
				message: 'got_rating_url',
				ratingURL: request.ratingURL
			});

			break;
		// successfully clocked in / out on tracksmart
		case "success-tracksmart":
			trackSmartResponse = 1;
			chrome.tabs.remove(sender.tab.id);
			break;
		// error clocking in / out on tracksmart
		case "error-tracksmart":
			trackSmartResponse = 0;
			// error meesage notification
			var options ={
				type: "basic",
				title: "Error on TrackSmart",
				message: "We encountered a problem on TrackSmart, please clock in/out manually.",
				iconUrl: "img/error.png",
				priority: 2,
				requireInteraction: true
			}
			chrome.notifications.create(options);
			break;
		// successfully posted to slack
		case "success-slack":
			slackResponse = 1;
			if(request.closeTab){
				chrome.tabs.remove(sender.tab.id);
			}
			break;
		// error posting to slack
		case "error-slack":
			slackResponse = 0;
			// error message notification
			var options ={
				type: "basic",
				title: "Error Posting to Slack",
				message: "There was a problem with posting to slack, please post manually.",
				iconUrl: "img/error.png",
				priority: 2,
				requireInteraction: true
			}
			chrome.notifications.create(options);
			break;
		// a new conversation was closed
		// case "convo-closed":
		// 	if(userData.working){
		// 		// increment the counter
		// 		userData.closedThisShift ++;
		// 		// update storage
		// 		chrome.storage.sync.set({'closedThisShift': userData.closedThisShift}, function(){
		// 			if(chrome.runtime.error){
		// 				console.log(chrome.runtime.error);
		// 			}
		// 		})
		// 	}
		// 	break;
		default:
			break;
	}

	// if all went well, notify the user
	if(trackSmartResponse && slackResponse){
		var opt ={
			type: "basic",
			title: "Success",
			message: "You're good to go!",
			iconUrl: "img/panda-48x48.png"
		}
		chrome.notifications.create(opt);
		trackSmartResponse = null;
		slackResponse = null;
	}

});

// close notification on click
chrome.notifications.onClicked.addListener(function(notificationId){
	chrome.notifications.clear(notificationId);
});
