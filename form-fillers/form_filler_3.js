document.getElementById("group_1544719003_2").checked = true

// Send new checkpoint
chrome.runtime.sendMessage({
	"message": "checkpoint",
	"goingToPage": 4
});

document.getElementById("ss-submit").click();