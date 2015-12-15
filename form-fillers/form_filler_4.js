chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {

	document.getElementById("entry_1712191337").value = response.data.other_notes;
	console.log("We're almost done!");
});