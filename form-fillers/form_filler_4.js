chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {

	// Check if a resource was given
	if (response.data.given_resource == "1")
		console.log("Resources not supported yet");
	else {
		document.getElementById("entry_1712191337").value = response.data.other_notes;
		console.log("We're almost done!");
	}
});