
// clock in/out on TrackSmart
function clockInOut(actionString){
	// wait 3 seconds to give page time to finish loading
	setTimeout(function(){
		var myMessage = "error-tracksmart";
		// if button exists
		if(document.getElementById(actionString)){
			// action listener to check whether the clock in / out was successfull
			document.getElementById(actionString).addEventListener("click", function(){
				myMessage = "success-tracksmart";
			});
			// clock in / out
			document.getElementById(actionString).click();
		}	
		chrome.runtime.sendMessage({message: myMessage});
	}, 3000);
}

chrome.runtime.onMessage.addListener(function(request, sender){
	clockInOut(request.message);
});

	