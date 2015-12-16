var thisPage = 4;
var data;

function fillTextAndValidate(selector, field) {

	var selectedElement = document.querySelector(selector);

	// Check that something was found
	if (selectedElement == undefined) {
		// If not, send error notification
		chrome.runtime.sendMessage({
			"message": "filling_failed",
			"page": thisPage,
			"field": field,
			"selector": selector
		});

		throw false;
	}

	// Fill the field
	selectedElement.value = data[field];

	// Check that it was properly filled
	if (selectedElement.value != data[field]) {
		// If not, send error notification
		chrome.runtime.sendMessage({
			"message": "filling_failed",
			"page": thisPage,
			"field": field,
			"value": data[field]
		});

		throw false;		
	}
}

chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {

	data = response.data;
	// Check if a resource was given
	if (response.data.given_resource == "1")
		console.log("Resources not supported yet");
	else {
		fillTextAndValidate(`[id="entry_1712191337"]`, `other_notes`);
		console.log("We're almost done!");

		// Send new checkpoint
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": 5
		});
	}
});