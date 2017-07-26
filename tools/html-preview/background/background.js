
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {	
	switch(request.message){
		case "open-preview":
			chrome.tabs.create({active: true, url: 'deploy/preview.html'}, function(tab){
			
				// Need to wait, otherwise message is lost
				setTimeout(function(){
					chrome.tabs.sendMessage(tab.id, {message: 'preview-page', html: request.html, css: request.css});
				}, 1000);
			});
			break;
		default:
			break;
	}
});