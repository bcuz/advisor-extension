import createSpreadsheet from './create-spreadsheet'

chrome.runtime.onMessage.addListener((response, sender, sendResponse) => {

	// Only run for invoice generation
	if (response.message == "popup") {
		if (response.id == "open-invoice") {
			console.log("Opening invoice");
			// Open tracksmart page and get records for the last 2 weeks
			chrome.tabs.create({
				url: 'https://timeclock.tracksmart.com/app/time/manage',
				active: false
				}, function(tab) {
					chrome.tabs.executeScript(tab.id, {
						file: "deploy/invoice_filler.js",
						runAt: "document_end"
					});
				}
			);
		}
	}

	if (response.message == 'generate-invoice') {
		console.log("Generate invoice")

		console.log("sender: " + sender.tab.id);
		// Get invoice data
		/*chrome.tabs.sendMessage(sender.tab.id, {
			message: 'get-invoice-data'
		}, (gotInvoiceData) => {*/
			chrome.storage.sync.get(['advisorAddress', 'advisorEmail'], data => {
				const invoiceData = Object.assign(response.invoiceData, data)
				console.log(invoiceData)
				const url = createSpreadsheet(invoiceData)
				const filename = `${invoiceData.userName.split(' ').join('-')}-invoice.xls`

				chrome.downloads.download({ filename, url })

				// Done, close tab
				sendResponse("done")
			})
		//});
	}
})
