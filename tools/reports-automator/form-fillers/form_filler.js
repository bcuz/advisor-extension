var thisPage = 1;
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

function checkAndValidate(selector, field) {
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
	selectedElement.checked = true;

	// Check that it was properly filled
	if (selectedElement.checked != true) {
		// If not, send error notification
		chrome.runtime.sendMessage({
			"message": "filling_failed",
			"page": thisPage,
			"field": field,
			"value": "false"
		});

		throw false;
	}
}

chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function (response) {

	for (i in response.data) {
		console.log("Field: " + i + " - Value: " + response.data[i]);
	}

	data = response.data;

	// Name
	fillTextAndValidate(`[aria-label*="Your Name"]`, `myName`);

	// URL
	fillTextAndValidate(`[aria-label*="Intercom"]`, `conversationURL`);

	// Time
	fillTextAndValidate(`[aria-label*="Hours"]`, `hours`);
	fillTextAndValidate(`[aria-label*="Minutes"]`, `minutes`);
	fillTextAndValidate(`[aria-label*="Seconds"]`, `seconds`);

	// Course
	fillTextAndValidate(`[name="entry.1578101060"]`, `course`);

	// Summary
	fillTextAndValidate(`[name="entry.1667357959"]`, `summary`);

	// User rate
	var id_to_check = "group_5170217_" + data.user_rate;
	checkAndValidate(`[id="${id_to_check}"]`, `user_rate`)

	// User rate notes
	fillTextAndValidate(`[id="entry_1328304469"]`, `user_rate_notes`);

	// Send another message to background to keep track of where we are
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": 2
	});

	// Click Continue - to part 2
	document.querySelector(`[type="submit"]`).click();
});
