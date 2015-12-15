chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {

	var id_to_check = "group_1544719003_" + response.data.given_resource;
	document.getElementById(id_to_check).checked = true

	// Send new checkpoint
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": 4
	});

	document.getElementById("ss-submit").click();
});