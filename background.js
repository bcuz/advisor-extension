var reportURL = "https://docs.google.com/forms/d/1RlohZ5t3mKU7KoCNz9Uh4z2Ytghw1n1qWqabfihXVlI/viewform";

var testing = "valueTesting";

var reportTab;

var data = {};

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// If this message comes from the popup
		if (request.message == "popup") {

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


		} else if (request.message == "open_report_tab") {

			// Save all variables in local storage, so we can get them from reports tab later
			for (field in request.data) {
				console.log("Field: " + field + " - Value: " + request.data[field]);
				//localStorage.setItem(field, request.data[field]);
			}

			data = request.data;
			console.log("Set data");

			chrome.tabs.create({url: reportURL}, function(tab) {
				reportTab = tab;
				chrome.tabs.executeScript(tab.id, {
					file: "form-fillers/form_filler.js",
					runAt: "document_end"
				});
			});


		} else if (request.message == "give_me_data") {
			sendResponse({
				data: data
			});
		}

		// Call the other screens in the form
		else if (request.message == "checkpoint") {
			// Script to load next
			var script = "form-fillers/form_filler_"+request.goingToPage + ".js";

			setTimeout(function() {
				chrome.tabs.executeScript(reportTab.id, {
					file: script,
					runAt: "document_end"
				});
			}, 5000);
		}
	}
);
