var thisPage = 2;
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
},  function(response) {
	data = response.data;
	var id_to_check;

	// Check that we're passing a valid value to this field
	if (response.data.interaction_user != "") {
		id_to_check = "group_244902865_" + response.data.interaction_user;
		checkAndValidate(`[id="${id_to_check}"]`, `interaction_user`);
	}

	if (response.data.interaction_user == "7")
		fillTextAndValidate(`[id="entry_244902865_other_option_response"]`, `interaction_user_other`);

	// Check that we're passing a valid value to this field
	if (response.data.interaction_adv != "") {
		id_to_check = "group_677684700_" + response.data.interaction_adv;
		checkAndValidate(`[id="${id_to_check}"]`, `interaction_adv`);
	}

	if (response.data.interaction_adv == "5")
		fillTextAndValidate(`[id="entry_677684700_other_option_response"]`, `interaction_adv_other`);

	// Send new checkpoint
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": 3
	});

	document.getElementById("ss-submit").click();
});