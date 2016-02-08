var thisPage = "rs1";
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


	fillTextAndValidate(`[id="entry_1107725395"]`, `resource1_title`);
	fillTextAndValidate(`[id='entry_1555194575']`, `resource1_link`);
	fillTextAndValidate(`[id='entry_986954396']`, `resource1_description`);

	var id_to_check = "group_367198721_" + response.data.more_than_one_resource;
	checkAndValidate(`[id="${id_to_check}"]`, `more_than_one_resource`);

	// Send new checkpoint

	// If one more resource was passed, go to page rs2
	if (response.data.more_than_one_resource == "1")
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": "rs2"
		});

	// Else, go to the last page
	else
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": 4
		});

	document.getElementById("ss-submit").click();
});