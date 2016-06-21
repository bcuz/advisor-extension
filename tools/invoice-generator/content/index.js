import getInvoiceData from './get-invoice-data'
import { $invoiceButton, $getRecordsButton } from './nodes'

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(request.message);
		if (request.message == 'get-invoice-data') {
			var invoiceData = getInvoiceData()
			console.log(invoiceData);
			sendResponse(invoiceData);
		}
})

$getRecordsButton.parentNode.appendChild($invoiceButton)

$invoiceButton.addEventListener('click', () => {
  const invoiceData = getInvoiceData()
  chrome.runtime.sendMessage({
  	message: 'generate-invoice',
  	invoiceData: invoiceData
  }, (message) => {
  	if (message == "done") {
  		success("Remember to export invoice to PDF to email it")
  		chrome.runtime.sendMessage({
			message: 'close_tab'
		});
  	}
  })
})