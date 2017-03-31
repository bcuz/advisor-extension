// global variables
var trackSmartResponse = null;
var slackResponse = null;
var working = false;

// set up user data
chrome.storage.sync.get({'working': false},
	function(results){
		working = results.working;
		if(chrome.runtime.error){
			console.log(chrome.runtime.error);
		}
	}
);

/********************************* ------------------ CLOCK IN/OUT FUNCTIONS -----------------*******************/

// open up the tabs when the user clocks in
function clockIn(){
	chrome.tabs.create({active: false, url: "https://timeclock.tracksmart.com/app/time"},
		function(tab){
			chrome.tabs.executeScript(tab.id,{
				file: "deploy/tracksmart.js",
				runAt: "document_end"
			}, function(){
				chrome.tabs.sendMessage(tab.id, {message: "clock-in"});
				if(chrome.runtime.lastError){
					console.log(chrome.runtime.lastError);
				}
			});
		}
	);

	chrome.tabs.create({active: false, url: "https://codecademy.slack.com/messages/proadvisors/"},
		function(tab){
			chrome.tabs.executeScript(tab.id, {file: "libs/moment.min.js"}, function(){
				chrome.tabs.executeScript(tab.id, { file: "libs/jquery-2.2.4.min.js"}, function(){
					chrome.tabs.executeScript(tab.id, { file: "deploy/slack.js", runAt: "document_end" }, function(){
						chrome.tabs.sendMessage(tab.id, {message: "clock-in"});
						if(chrome.runtime.lastError){
							console.log(chrome.runtime.lastError);
						}
					});
				})
			});
		}
	);
	chrome.tabs.create({url: "https://app.intercom.io/a/apps/wft4jxth/inbox/unassigned"}, function(){
		if(chrome.runtime.lastError){
			console.log(chrome.runtime.lastError);
		}
	});

	// set the working variable to true
	working = true;
	// store data in case browser is closed
	chrome.storage.sync.set({'working': true}, function(){
		if(chrome.runtime.error){
			console.log(chrome.runtime.error);
		}
	})
}


function clockOut(){
	// no longer working
	working = false;

	// clock out on slack
	chrome.tabs.create({active: false, url: "https://codecademy.slack.com/messages/proadvisors/"},
		function(tab){
			chrome.tabs.executeScript(tab.id, {file: "libs/moment.min.js"}, function(){
				chrome.tabs.executeScript(tab.id, { file: "libs/jquery-2.2.4.min.js"}, function(){
					chrome.tabs.executeScript(tab.id, { file: "deploy/slack.js", runAt: "document_end" }, function(){
						chrome.tabs.sendMessage(tab.id, {message: "clock-out"});
						if(chrome.runtime.lastError){
							console.log(chrome.runtime.lastError);
						}
					});
				})
			});
		}
	);

	// clock out on tracksmart
	chrome.tabs.create({active: false, url: "https://timeclock.tracksmart.com/app/time"},
		function(tab){
			chrome.tabs.executeScript(tab.id,{
				file: "deploy/tracksmart.js",
				runAt: "document_end"
			}, function(){
				chrome.tabs.sendMessage(tab.id, {message: "clock-out"});
				if(chrome.runtime.lastError){
					console.log(chrome.runtime.lastError);
				}
			});
		}
	);
	// store data for later use
	chrome.storage.sync.set({'working': false},
		function(){
			if(chrome.runtime.lastError){
				console.log(chrome.runtime.lastError);
			}
		}
	)
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	switch(request.message) {
		case "get-status":
			sendResponse({data: working});
			break;
		case "clock-user-in":
			clockIn();
			break;
		case "clock-user-out":
			clockOut();
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









