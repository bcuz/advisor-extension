chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {

	var id_to_check;

	// Check that we're passing a valid value to this field
	if (response.data.interaction_user != "") {
		id_to_check = "group_244902865_" + response.data.interaction_user;
		document.getElementById(id_to_check).checked = true;
	}
	document.getElementById("entry_244902865_other_option_response").value = response.data.interaction_user_other;

	// Check that we're passing a valid value to this field
	if (response.data.interaction_adv != "") {
		id_to_check = "group_677684700_" + response.data.interaction_adv;
		document.getElementById(id_to_check).checked = true;
	}
	document.getElementById("entry_677684700_other_option_response").value = response.data.interaction_adv_other;

	// Send new checkpoint
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": 3
	});

	document.getElementById("ss-submit").click();
});