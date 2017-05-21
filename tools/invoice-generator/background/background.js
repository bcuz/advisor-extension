
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	if(request.id === "open-invoice"){
		chrome.tabs.create({active: true, url: 'https://codecademy.wheniwork.com/payroll/'},
			function(tab){
				chrome.tabs.executeScript(tab.id, {file: 'libs/jquery-2.2.4.min.js'},
					function(){
						chrome.tabs.executeScript(tab.id, {file: 'deploy/create_invoice.js', runAt: 'document_end'});
					}
				);
			}
		);
	}
})