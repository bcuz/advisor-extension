var reportURL = "https://docs.google.com/forms/d/1RlohZ5t3mKU7KoCNz9Uh4z2Ytghw1n1qWqabfihXVlI/viewform";

var testing = "valueTesting";

var reportTab;

localStorage.setItem("enabled", "false");
localStorage.setItem("side_panel", "false");

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
					console.log(activeTab.title);
					enabled = localStorage.getItem("enabled");
					enabled = (enabled == "false") ? "true" : "false";
					localStorage.setItem("enabled", enabled);
					console.log(enabled);

					chrome.tabs.sendMessage(activeTab.id, {
						"message": "start",
						"enabled": enabled
					});

					// Set the text status in the browser action icon
					var browserActionStatus = (enabled == "true") ? "ON" : "";
					console.log("Badge: " + browserActionStatus);
					chrome.browserAction.setBadgeText({text: browserActionStatus});

				});				

			} else if (request.id == "report-panel") {
				// Open the report panel... not yet
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					var activeTab = tabs[0];
					side_panel = localStorage.getItem("side_panel");
					side_panel = (side_panel == "true") ? "false" : "true";
					localStorage.setItem("side_panel", side_panel);
					console.log(side_panel);

					chrome.tabs.sendMessage(activeTab.id, {
						"message": "side-panel",
						"enabled": side_panel
					});
				});
			}


		} else if (request.message == "open_report_tab") {

			var conversationURL = request.conversationURL;
			var summary = request.summary;
			localStorage.setItem("conversationURL", request.conversationURL);
			localStorage.setItem("summary", request.summary);
			
			chrome.tabs.create({url: reportURL}, function(tab) {
				reportTab = tab;
				chrome.tabs.executeScript(tab.id, {
					file: "form-fillers/form_filler.js",
					runAt: "document_end"
				});
			});


		} else if (request.message == "give_me_data_yo") {

			var conversationURL = localStorage.getItem("conversationURL");
			var summary = localStorage.getItem("summary");

			sendResponse({
				conversationURL: conversationURL,
				summary: summary
			});
		}

		// Call the other screens in the form
		else if (request.message == "checkpoint") {
			// Script to load next
			var script = "form_filler_"+request.goingToPage + ".js";

			setTimeout(function() {
				chrome.tabs.executeScript(reportTab.id, {
					file: script,
					runAt: "document_end"
				});
			}, 5000);
		}
	}
);