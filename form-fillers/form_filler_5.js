// This should be the confirmation page after a report was submitted
console.log("This will be replaced with the check of the report that was submitted");

// Notify that this report is successful
chrome.runtime.sendMessage({
	"message": "report-success"
});