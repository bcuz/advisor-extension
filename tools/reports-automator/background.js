var reportURL = "https://docs.google.com/forms/d/1RlohZ5t3mKU7KoCNz9Uh4z2Ytghw1n1qWqabfihXVlI/viewform";
var newReportURL = "https://docs.google.com/forms/d/1jk8KkJ_JVvXhIsiSI_YfRtEZk_40wRhTOXevwHSTSKQ/viewform";

// Hold the data shared between intercom and report tabs
var data = {};

// Save the intercom tab for notifications
var intercomTab;

// Get saved options
var advisorName = "";
var timeBetweenScreensForm = "";

// Initialize options saved
function pullOptions() {
	chrome.storage.sync.get({
	    advisorName: '',
	    timeBetweenScreensForm: "5"
	  }, function(items) {
	    advisorName = items.advisorName;
	    timeBetweenScreensForm = items.timeBetweenScreensForm;
	    console.log("Options updated! Name: " + advisorName + " - time: " + timeBetweenScreensForm);
	});
}

pullOptions();

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

	// If this message comes from the popup
	if (request.message == "update-options") {
		pullOptions();
	}
	else if (request.message == "popup") {

		console.log("received message popup");
		// Start/stop the report data collection
		if (request.id == "start-stop") {
			console.log("received start-stop");

			
			/* GARBAGE COLLECTION */
			// Before rendering panel, check if there's any data older than 12 hours from current time
			if (data.lastTimeUpdated != undefined) {
				// Get the date for 12 hours ago since now
				var now = new Date();
				var twelveHoursAgo = new Date();
				twelveHoursAgo.setHours(now.getHours() - 12);

				// Check if the last time data was updated is older than 12 hours
				// If it is, clean up data
				if (twelveHoursAgo > data.lastTimeUpdated) {
					console.log("Data is older than 12 hours ago, cleaning it up...");
					data = {};
				}
			}


			// Send a message to the active tab
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				var activeTab = tabs[0];

				// Only send an arbitrary start-stop message, state is maintained per tab
				chrome.tabs.sendMessage(activeTab.id, {
					"message": "start-stop",
				});
			});				

		}

		// Open options page
		else if (request.id == "open-options") {
			window.open(chrome.runtime.getURL('ui/options.html'));
		}

	} 
	else if (request.message == "open_report_tab") {

		// Save intercom tab
		intercomTab = sender.tab.id;

		// Save all variables in local storage, so we can get them from reports tab later
		for (field in request.data) {
			console.log("Field: " + field + " - Value: " + request.data[field]);
		}

		chrome.tabs.create({
			url: newReportURL,
			active: false
			}, function(tab) {
				reportTab = tab;

				// Get interactionID of this request
				var conversationURL = request.data.conversationURL;
				var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

				// Check if there's a previous failed report with same interactionID
				// If there is one, remove it from memory
				if (data[interactionID] != undefined && data[interactionID]["success"] == false) {
					console.log("Found old report, remove it: " + data[interactionID].user_name + " - " + interactionID);
					data[interactionID] = null;
				}

				// Store the data using this tab's ID
				data[tab.id] = request.data;

				// Set advisor name
				data[tab.id]["myName"] = advisorName;

				chrome.tabs.executeScript(tab.id, {
					file: "tools/reports-automator/form-fillers/form_filler_new.js",
					runAt: "document_end"
				});
			}
		);

	} 
	else if (request.message == "give_me_data") {
		var requestorTabID = sender.tab.id;

		// If intercom tab is asking for the information, take the tabID parameter
		if (request.tabID != undefined)
			requestorTabID = request.tabID;

		console.log("Requestor is: " + requestorTabID);
		console.log("Data found: " + JSON.stringify(data[requestorTabID]));

		sendResponse({
			data: data[requestorTabID]
		});
	}

	// Call the other screens in the form
	else if (request.message == "checkpoint") {
		var requestorTabID = sender.tab.id;
		// Script to load next
		var script = "tools/reports-automator/form-fillers/form_filler_"+request.goingToPage + ".js";

		console.log("Checkpoint - calling next in script in " + (timeBetweenScreensForm*1000));

		setTimeout(function() {
			chrome.tabs.executeScript(requestorTabID, {
				file: script,
				runAt: "document_end"
			});
		}, timeBetweenScreensForm * 1000);
	}

	else if (request.message == "filling_failed") {
		var requestorTabID = sender.tab.id;
		console.log("Failed filling for id " + sender.tab.id);
		console.log("Page: " + request.page + " - Field: " + request.field);
		console.log("Selector: " + request.selector + " - Value: " + request.value);

		data[requestorTabID]["success"] = false;

		// Get the interaction ID
		var conversationURL = data[requestorTabID]["conversationURL"];
		var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

		// Clone data with interactionID as new ID
		data[interactionID] = data[requestorTabID];
		// Remove old copy that uses tabID
		data[requestorTabID] = null;

		// Notify failure to intercom tab
		chrome.tabs.sendMessage(intercomTab, {
			message: "filling_failed",
			interactionID: interactionID,
			userName: data[interactionID]["user_name"]
		});
	}

	else if (request.message == "report-success") {
		var requestorTabID = sender.tab.id;
		// Update this tab ID in data
		// We'll replace tab ID with the interactionID

		// Get the interaction ID
		var conversationURL = data[requestorTabID]["conversationURL"];
		var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

		// Clone data with interactionID as new ID
		data[interactionID] = data[requestorTabID];
		// Remove old copy that uses tabID
		data[requestorTabID] = null;

		// Mark field for success
		data[interactionID]["success"] = true;

		// Update timestamp of last update performed (used for cleaning up old data)
		data.lastTimeUpdated = new Date();

		// Notify failure to intercom tab
		chrome.tabs.sendMessage(intercomTab, {
			message: "filling_success",
			userName: data[interactionID]["user_name"],
			interactionID: interactionID
		});

		// Report success to user
		console.log("Success report!  ID#: " + interactionID);
	}

	// URL rating
	else if (request.message == "url_rating") {

		intercomTab = sender.tab.id;

		chrome.tabs.create({
			url: 'https://www.codecademy.com/advisors/survey/new',
			active: false
			}, function(tab) {
				convoURL = request.convoURL;

				chrome.tabs.executeScript(tab.id, {
					file: "tools/reports-automator/form-fillers/rating_filler.js",
					runAt: "document_end"
				});
			}
		);
	}

	else if (request.message == "need_rating_url") {
		sendResponse({
			convoURL: convoURL
		})
	}

	else if (request.message == "got_rating_url") {
		console.log("received ratingURL: " + request.ratingURL);

		// Close the generation url tab
		chrome.tabs.remove(sender.tab.id);

		// Send the rating url back to intercom
		chrome.tabs.sendMessage(intercomTab, {
			message: 'got_rating_url',
			ratingURL: request.ratingURL
		});

		console.log("send to intercomtab");
	}
});
