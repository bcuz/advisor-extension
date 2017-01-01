// global variables
var trackSmartResponse = null;
var slackResponse = null;
//var slackTab;
var userData = {
	working: false,
	// totalHours: 0,
	// totalClosedConvos: 0,
	// clockInTime: null,
	// closedThisShift: 0
}

// set up user data
chrome.storage.sync.get({'working': false/*, 'totalHours': 0, 'totalClosedConvos': 0, 'clockInTime': null, 'closedThisShift': 0*/},
	function(results){
		userData.working = results.working;
		// userData.totalHours = results.totalHours;
		// userData.totalClosedConvos = results.totalClosedConvos;
		// if(results.clockInTime){
		// 	userData.clockInTime = moment(JSON.parse(results.clockInTime));
		// }
		// userData.closedThisShift = results.closedThisShift;
		if(chrome.runtime.error){
			console.log(chrome.runtime.error);
		}
		console.log(results);
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

	chrome.tabs.create({active: false, url: "https://codecademy.slack.com/messages/proadvisors/details/"},
		function(tab){
			//slackTab = tab;
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
	userData.working = true;
	// clock in time
	// userData.clockInTime = moment();
	// // store data in case browser is closed
	// var stringTime = JSON.stringify(userData.clockInTime); // cannot store objects in chrome.storage
	chrome.storage.sync.set({'working': true/*, 'clockInTime': stringTime*/}, function(){
		if(chrome.runtime.error){
			console.log(chrome.runtime.error);
		}
	})
}


function clockOut(){
	// no longer working
	userData.working = false;

	// clock out on slack
	chrome.tabs.create({active: false, url: "https://codecademy.slack.com/messages/proadvisors/details/"},
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
	// update the total convos (totalHours is updated by popup.js)
	//userData.totalClosedConvos += userData.closedThisShift;
	// store data for later use
	chrome.storage.sync.set({'working': false/*, 'totalClosedConvos': userData.totalClosedConvos,
		'closedThisShift': 0, 'clockInTime': null, 'totalHours': userData.totalHours*/},
		function(){
			if(chrome.runtime.lastError){
				console.log(chrome.runtime.lastError);
			}
		}
	)
	// clean up unused variables
	userData.clockInTime = null;
	userData.closedThisShift = 0;
	//slackTab = null;
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	switch(request.message) {
		case "get-user-data":
			sendResponse({data: userData});
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









