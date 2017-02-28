thisPage = "submit";

// click the submit button
document.getElementById("ss-submit").click();

// Continue to confirmation page
chrome.runtime.sendMessage({
	"message": "checkpoint",
	"goingToPage": "confirmation"
});