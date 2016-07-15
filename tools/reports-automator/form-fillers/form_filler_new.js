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

	// Able to solve user issue
	if (response.data.able_solve_issue != "") {
		id_to_check = "group_1819799503_" + response.data.able_solve_issue;
		checkAndValidate(`[id="${id_to_check}"]`, `able_solve_issue`);
	}


	// User rate
	var id_to_check = "group_1881757241_" + data.user_rate;
	checkAndValidate(`[id="${id_to_check}"]`, `user_rate`);

	// User rate notes
	fillTextAndValidate(`[name="entry.748200867"]`, `user_rate_notes`);

	// Summary
	fillTextAndValidate(`[name="entry.1090271664"]`, `summary`);

	// Panic button
	var id_to_check = "group_767547732_" + data.panic_button;
	checkAndValidate(`[id="${id_to_check}"]`, `panic_button`);

	// Product suggestion - Bug report
	var id_to_check = "group_1424754551_" + data.suggestion_or_bug;
	checkAndValidate(`[id="${id_to_check}"]`, `suggestion_or_bug`);

	// Type of Conversation
	var id_to_check = "group_260280481_" + data.convo_type;
	checkAndValidate(`[id="${id_to_check}"]`, `convo_type`);

	// Code trouble (hack for checkbox)
	for (var i = 0; i < data.issue_type.length; i++) {
		var buffer = data.issue_type[i];
		console.log(buffer);
		if (buffer == 1) {
			var id_to_check = "group_1265779157_" + (i+1);
			console.log(id_to_check);
			document.querySelector(`[id="${id_to_check}"]`).checked = true;
		}
	}

	// Course
	fillTextAndValidate(`[name="entry.856943265"]`, `course`);

	// Additional notes
	fillTextAndValidate(`[name="entry.1525920400"]`, `other_notes`);

	// Time
	fillTextAndValidate(`[aria-label*="Hours"]`, `hours`);
	fillTextAndValidate(`[aria-label*="Seconds"]`, `seconds`);
	fillTextAndValidate(`[aria-label*="Minutes"]`, `minutes`);

	// Continue to next confirmation page
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": "confirmation"
	});

	// Click Submit
	document.querySelector(`[type="submit"]`).click();

	// Notify that this report is successful
	/*chrome.runtime.sendMessage({
		"message": "report-success"
	});*/
});
