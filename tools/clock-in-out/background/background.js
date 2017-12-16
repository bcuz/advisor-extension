// global variables
var wheniworkResponse = null;
var slackResponse = null;
var working = false;

// set up user data
chrome.storage.sync.get({'working': false},
	function(results){
		catchErrors();
		working = results.working;
	}
);

function catchErrors(){
	if(chrome.runtime.lastError)
		console.log(chrome.runtime.lastError);
}

function errorNotification(title, msg){
	const options ={
		type: "basic",
		title: title,
		message: msg,
		iconUrl: "img/error.png",
		priority: 2,
		requireInteraction: true
	}
	chrome.notifications.create(options);
}
/********************************* ------------------ CLOCK IN/OUT FUNCTIONS -----------------*******************/

// open up the tabs when the user clocks in
function clockIn(){
	chrome.tabs.create({active: false, url: "https://codecademy.wheniwork.com/"},
		function(tab){
			chrome.tabs.executeScript(tab.id,{
				file: "deploy/wheniwork.js",
				runAt: "document_end"
			}, function(){
				chrome.tabs.sendMessage(tab.id, {message: "clock-in"});
				catchErrors();
			});
		}
	);

	chrome.tabs.create({active: false, url: "https://codecademy.slack.com/messages/proadvisors/"},
		function(tab){
			chrome.tabs.executeScript(tab.id, {file: "libs/moment.min.js"}, function(){
				catchErrors();
				chrome.tabs.executeScript(tab.id, { file: "libs/jquery-2.2.4.min.js"}, function(){
					catchErrors();
					chrome.tabs.executeScript(tab.id, { file: "deploy/slack.js", runAt: "document_end" }, function(){
						chrome.tabs.sendMessage(tab.id, {message: "clock-in"});
						catchErrors();
					});
				})
			});
		}
	);
	chrome.tabs.create({url: "https://app.intercom.io/a/apps/wft4jxth/inbox/unassigned"}, function(){
		catchErrors();
	});

	// set the working variable to true
	working = true;
	// store data in case browser is closed
	chrome.storage.sync.set({'working': true}, function(){
		catchErrors();
	})
}


function clockOut(){
	// no longer working
	working = false;

	// clock out on slack
	chrome.tabs.create({active: false, url: "https://codecademy.slack.com/messages/proadvisors/"},
		function(tab){
			chrome.tabs.executeScript(tab.id, {file: "libs/moment.min.js"}, function(){
				catchErrors();
				chrome.tabs.executeScript(tab.id, { file: "libs/jquery-2.2.4.min.js"}, function(){
					catchErrors();
					chrome.tabs.executeScript(tab.id, { file: "deploy/slack.js", runAt: "document_end" }, function(){
						catchErrors();
						chrome.tabs.sendMessage(tab.id, {message: "clock-out"});
					});
				})
			});
		}
	);

	// clock out on when i work
	chrome.tabs.create({active: false, url: "https://codecademy.wheniwork.com/"},
		function(tab){
			chrome.tabs.executeScript(tab.id,{
				file: "deploy/wheniwork.js",
				runAt: "document_end"
			}, function(){
				chrome.tabs.sendMessage(tab.id, {message: "clock-out"});
				catchErrors();
			});
		}
	);
	// store data for later use
	chrome.storage.sync.set({'working': false},
		() => { catchErrors(); }
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
		// successfully clocked in / out on when i work
		case "success-wheniwork":
			wheniworkResponse = 1;
			chrome.tabs.remove(sender.tab.id);
			break;
		// error clocking in / out on when i work
		case "error-wheniwork":
			wheniworkResponse = 0;
			errorNotification("Error on When I Work",
				"Encountered a problem on When I Work. Please clock in/out manually.")
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
			errorNotification("Error Posting to Slack", 
				"There was a problem with posting to slack. Please post manually.")
			break;
		case "went-to-login":
			// User logged in, wait a sec for when I work to do its thing
			// and then try to clock in/out again
			setTimeout(function(){
				chrome.tabs.executeScript(sender.tab.id,{
					file: "deploy/wheniwork.js",
					runAt: "document_end"
				}, function(){
					catchErrors();
					chrome.tabs.sendMessage(sender.tab.id, {message: request.action});
				});
			}, 2000);
			break;
		case 'highlight-me':
			// change the active tab
			chrome.tabs.update(sender.tab.id, {highlighted: true});
		default:
			break;
	}

	// if all went well, notify the user
	if(wheniworkResponse && slackResponse){
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









