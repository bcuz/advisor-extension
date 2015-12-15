chrome.runtime.sendMessage({
	"message": "give_me_data"
},  function(response) {

		for (i in response.data) {
			console.log("Field: " + i);
			console.log("Value: " + response.data[i]);
		}

		// URL
		document.querySelector('[aria-label*="Intercom"]').value = response.data.conversationURL;

		// Name
		document.querySelector('[aria-label*="Your Name"]').value = response.data.myName;

		// Time
		document.querySelector('[aria-label*="Hours"]').value = response.data.hours;
		document.querySelector('[aria-label*="Minutes"]').value = response.data.minutes;
		document.querySelector('[aria-label*="Seconds"]').value = response.data.seconds;

		// Course
		document.querySelector('[name="entry.1578101060"]').value = response.data.course;

		// Summary
		document.querySelector('[name="entry.1667357959"]').value = response.data.summary;

		// User rate
		var id_to_check = "group_5170217_" + response.data.user_rate;
		document.querySelector(`[id="${id_to_check}"]`).checked = true;

		// User rate notes
		document.querySelector(`[id="entry_1328304469"]`).value = response.data.user_rate_notes;

		// Send another message to background to keep track of where we are
		chrome.runtime.sendMessage({
			"message": "checkpoint",
			"goingToPage": 2
		});

		// Click Continue - to part 2
		document.querySelector(`[type="submit"]`).click();
});
