
chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {
		// URL
		var input = document.querySelector('[aria-label*="Intercom"]');
		input.value = response.conversationURL;

		// Name
		document.querySelector('[aria-label*="Your Name"]').value = response.myName;

		// Course
		document.querySelector('[name="entry.1578101060"]').value = "";

		// Summary
		document.querySelector('[name="entry.1667357959"]').value = response.summary;

		// Easieness
		document.querySelector('[id="group_5170217_5"]').checked = true;
/*
		// Send another message to background to keep track of where we are
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": 2
		});

		// Click Continue - to part 2
		document.querySelector('[type="submit"]').click();*/
});
