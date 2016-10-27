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
				file: "deploy/login.js",
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
				chrome.tabs.executeScript(tab.id, { file: "libs/jquery-2.1.4.js"}, function(){
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
				chrome.tabs.executeScript(tab.id, { file: "libs/jquery-2.1.4.js"}, function(){
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
				file: "deploy/login.js",
				runAt: "document_end"
			}, function(){
				chrome.tabs.sendMessage(tab.id, {message: "clock-out"});
				if(chrome.runtime.lastError){
					console.log(chrome.runtime.lastError);
				}
			});
		}
	);
	// open the post shift report tab
	// chrome.tabs.create({active: false, url: "https://docs.google.com/forms/d/e/1FAIpQLSciPORNy-a1iO-75rLK_suwJaBfWGzA-GlQPVVLAvRNQ_DW5w/viewform"});
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
	slackTab = null;
}








