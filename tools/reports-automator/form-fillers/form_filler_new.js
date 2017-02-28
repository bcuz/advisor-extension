var data;

function fillTextAndValidate(selector, field) {

	var selectedElement = document.querySelector(selector);

	// Check that something was found
	if (selectedElement == undefined) {
		// If not, send error notification
		chrome.runtime.sendMessage({
			"message": "filling_failed",
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
	fillTextAndValidate(`[name='entry.1957964296']`, `myName`);

	// URL
	fillTextAndValidate(`[name='entry.995604322']`, `conversationURL`);

	// Type of Conversation
	// var id_to_check = "group_260280481_" + data.convo_type;
	// checkAndValidate(`[id="${id_to_check}"]`, `convo_type`);
	for(var i = 0; i < data.convo_type.length; i++){
		var buffer = data.convo_type[i];
		if(buffer == 1){
			var id_to_check = "group_260280481_" + (i+1);
	 		console.log(id_to_check);
			document.querySelector(`[id="${id_to_check}"]`).checked = true;
		}
	}

	// Code trouble (hack for checkbox)
	// for (var i = 0; i < data.issue_type.length; i++) {
	// 	var buffer = data.issue_type[i];
	// 	console.log(buffer);
	// 	if (buffer == 1) {
	// 		var id_to_check = "group_1265779157_" + (i+1);
	// 		console.log(id_to_check);
	// 		document.querySelector(`[id="${id_to_check}"]`).checked = true;
	// 	}
	// }

	// Other
	fillTextAndValidate(`[name="entry.260280481.other_option_response"]`, `other`);

	// Course
	fillTextAndValidate(`[name="entry.856943265"]`, `course`);

	// Additional notes
	fillTextAndValidate(`[name="entry.1525920400"]`, `other_notes`);

	// Time
	fillTextAndValidate(`[aria-label*="Hours"]`, `hours`);
	fillTextAndValidate(`[aria-label*="Seconds"]`, `seconds`);
	fillTextAndValidate(`[aria-label*="Minutes"]`, `minutes`);

	// Continue to next submit page
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": "submit"
	});

	// Click Submit
	document.querySelector(`[type="submit"]`).click();
});
