
chrome.runtime.sendMessage({
	"message": "give_me_data_yo"
},  function(response) {
	// Lets see if this works
	document.getElementById("group_244902865_7").checked = true;
	document.getElementById("entry_244902865_other_option_response").value = "Testing";

	// Send new checkpoint
	chrome.runtime.sendMessage({
		"message": "checkpoint",
		"goingToPage": 3
	});

	document.getElementById("ss-submit").click();
});