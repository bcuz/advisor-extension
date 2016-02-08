var thisPage = 3;
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
	var id_to_check = "group_1544719003_" + response.data.given_resource;
	checkAndValidate(`[id="${id_to_check}"]`, `given_resource`);

	// Send new checkpoint

	// If a resource was passed, go to page rs1
	if (response.data.given_resource == "1")
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": "rs1"
		});

	// Else, go to the last page
	else
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": 4
		});

	document.getElementById("ss-submit").click();
});