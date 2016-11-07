
chrome.runtime.onMessage.addListener(function(request, sender){
	var actionString = request.message;
	// Clock in/out on tracksmart.
	// First wait for page to finish loading.
	setTimeout(function(){
		var myMessage = "error-tracksmart";

		// if button exists
		if(document.getElementById(actionString)){
			// Check whether the clock in / out was successfull.
			document.getElementById(actionString).addEventListener("click", function(){
				// Confirm that the click went through by finding the opposite button.
				var checkString = actionString === "clock-in" ? "clock-out" : "clock-in";
				setTimeout(function(){ // Wait for page to update
					if(document.getElementById(checkString)) myMessage = "success-tracksmart";
					sendMessage(myMessage); // Notify of success or failure
				}, 300);
				
			});
			// clock in / out
			document.getElementById(actionString).click();
		}else{
			sendMessage(myMessage);
		}
		
	}, 2000);
	
});

// Send a message to the background script letting it know whether clock in/out was successful.
function sendMessage(myMessage){
	chrome.runtime.sendMessage({message: myMessage});
}
