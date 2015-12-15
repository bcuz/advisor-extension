var reportURL = "https://docs.google.com/forms/d/1RlohZ5t3mKU7KoCNz9Uh4z2Ytghw1n1qWqabfihXVlI/viewform";

// Hold the data shared between intercom and report tabs
var data = {};

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

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// If this message comes from the popup
		if (request.message == "update-options") {
			pullOptions();
		}
		else if (request.message == "popup") {

			console.log("received message popup");
			// Start/stop the report data collection
			if (request.id == "start-stop") {
				console.log("received start-stop");

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

		} else if (request.message == "open_report_tab") {

			// Save all variables in local storage, so we can get them from reports tab later
			for (field in request.data) {
				console.log("Field: " + field + " - Value: " + request.data[field]);
			}

			chrome.tabs.create({url: reportURL}, function(tab) {
				reportTab = tab;

				// Store the data using this tab's ID
				data[tab.id] = request.data;

				// Set advisor name
				data[tab.id]["myName"] = advisorName;

				chrome.tabs.executeScript(tab.id, {
					file: "form-fillers/form_filler.js",
					runAt: "document_end"
				});
			});

		} else if (request.message == "give_me_data") {
			// Get the id of the tab that's asking for data
			var requestorTabID = sender.tab.id;
			console.log("Requestor is: " + requestorTabID);
			console.log("Data found: " + JSON.stringify(data[requestorTabID]));

			sendResponse({
				data: data[requestorTabID]
			});
		}

		// Call the other screens in the form
		else if (request.message == "checkpoint") {
			// Script to load next
			var script = "form-fillers/form_filler_"+request.goingToPage + ".js";

			// Requestor tab's ID
			var requestorTabID = sender.tab.id;

			setTimeout(function() {
				chrome.tabs.executeScript(requestorTabID, {
					file: script,
					runAt: "document_end"
				});
			}, timeBetweenScreensForm);
		}

		else if (request.message == "report-success") {
			// Requestor tab's ID
			var requestorTabID = sender.tab.id;

			// Update this tab ID in data
			// We'll replace tab ID with the interactionID

			// Get the interaction ID
			var conversationURL = data[requestorTabID]["conversationURL"];
			var interactionID = conversationURL.split("/")[conversationURL.split("/").length - 1];

			// Clone data with interactionID as new ID
			data[interactionID] = data[requestorTabID];
			// Remove old copy that uses tabID
			data[requestorTabID] = {};

			// Mark field for success
			data[interactionID]["success"] = true;

			// Report success to user
			console.log("Success report!  ID#: " + interactionID);
		}
	}
);
