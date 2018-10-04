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
	var name = data['myName']
	setTimeout(function(){

		document.querySelector('.quantumWizMenuPaperselectOption').classList.remove('isSelected');
		document.querySelector('.quantumWizMenuPaperselectOption').setAttribute("aria-selected", false)
		document.querySelector('.quantumWizMenuPaperselectOption').setAttribute("tabindex", -1)

		document.querySelector(`[data-value="${name}"]`).setAttribute("aria-selected", true)
		document.querySelector(`[data-value="${name}"]`).setAttribute("tabindex", 0)
		document.querySelector(`[data-value="${name}"]`).classList.add('isSelected');
		// fillTextAndValidate(`[name='entry.1957964296']`, `myName`);

		// URL
		fillTextAndValidate(`[name='entry.995604322']`, `conversationURL`);

		// Type of Conversation - checkbox hack
		var stuff = ["I explained a concept", "I corrected a syntax error (eg: missing semi-colon)", 
					"I onboarded a new user",
					"I directed user on what to learn next", "I gave career or industry advice",
					"I received and filed a bug report", "I received a product suggestion", 
					"It was a Personal Project (Off-Platform)", "This was a conversation about Ready material",
					"I re-directed to customer service", "Other:"]

		for(var i = 0; i < data.convo_type.length; i++){
			var buffer = data.convo_type[i];
			if(buffer == 1){
				// var id_to_check = "group_260280481_" + (i+1);
				var id_to_check = stuff[i];
		 		console.log(id_to_check);
				document.querySelector(`[aria-label="${id_to_check}"]`).classList.add('isChecked');
				document.querySelector(`[aria-label="${id_to_check}"]`).setAttribute("aria-checked", true);
			}
		}

		// Other
		// didnt look into this that hard, could later
		fillTextAndValidate(`[aria-label="Other response"]`, `other`);
		// document.querySelector('[aria-label="Other response"][data-initial-value]').setAttribute("badinput", false);
		// document.querySelector('[aria-label="Other response"][data-initial-value]').setAttribute("data-initial-value", "placehold");
		// document.querySelector('.quantumWizTextinputSimpleinputEl').classList.add('hasValue')

		// Course
		var courseName = data['course']
		// document.querySelectorAll('.quantumWizMenuPaperselectOptionList')[1] 
		document.querySelectorAll('.quantumWizMenuPaperselectOptionList')[1].querySelector('.quantumWizMenuPaperselectOption').classList.remove('isSelected');
		document.querySelectorAll('.quantumWizMenuPaperselectOptionList')[1].querySelector('.quantumWizMenuPaperselectOption').setAttribute("aria-selected", false)
		document.querySelectorAll('.quantumWizMenuPaperselectOptionList')[1].querySelector('.quantumWizMenuPaperselectOption').setAttribute("tabindex", -1)

		document.querySelector(`[data-value="${courseName}"]`).setAttribute("aria-selected", true)
		document.querySelector(`[data-value="${courseName}"]`).setAttribute("tabindex", 0)
		document.querySelector(`[data-value="${courseName}"]`).classList.add('isSelected');
		// fillTextAndValidate(`[name="entry.856943265"]`, `course`);

		// Additional notes
		fillTextAndValidate(`[name="entry.1525920400"]`, `other_notes`);

		// Time

		// still not working
		// if (data.hours === "0") {
		// 	data.hours = "00"		
		// }
		// document.querySelector('[aria-label="Hours"]').setAttribute("badinput", false);
		// document.querySelector('[aria-label="Hours"]').setAttribute("data-initial-value", data['hours']);
		// document.querySelectorAll('.quantumWizTextinputPaperinputEl')[1].classList.add('hasValue');
		
		fillTextAndValidate(`[aria-label*="Hours"]`, `hours`);
		// document.querySelector('[aria-label="Hours"]').value = data['hours'];
		fillTextAndValidate(`[aria-label*="Seconds"]`, `seconds`);
		fillTextAndValidate(`[aria-label*="Minutes"]`, `minutes`);
		
		// Continue to next confirmation page
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": "confirmation"
		});

		// Click Submit
		document.querySelector('.quantumWizButtonPaperbuttonFocusOverlay').click();
	}, 250)


});
