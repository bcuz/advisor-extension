// automatic "here for --" message in Slack

// check if DST
var offset;
if(moment().isDST()){
  offset = -240; // if DST, UTC offset in ET is -4 hours
}else{
  offset = -300; // if not, UTC offset in ET is -5 hours
}
// get eastern time
var eTime = moment().utcOffset(offset);
var hourNow = parseInt(eTime.format("h"));
var minNow = parseInt(eTime.format("mm"));
if(minNow > 45){
  if(hourNow === 12) hourNow = 1;
  else hourNow += 1;
}

var actionString = null;
var clicked = false;
var closeTab = false;

$.noConflict();
jQuery(document).ready(function($){
	// listen for keypress
	$(document).on('click', '#submit-button', function(){
		clicked = true;
	});
	// Add a submit button to the form, and then click it
	$('#msg_form').append('<input type="submit" value="" id="submit-button" style="display:none">');
 	// First wait 1 second to give page time to finish loading
	setTimeout(function(){
		if ($('#msg_input').length > 0) {
			$('#msg_input p').text(actionString);
		}
		var result = $('#msg_input p').text();

		// Need to wait for Slack's scripts to do their thing before trying to submit
		setTimeout(function(){
			
			// Post the message
			document.getElementById("submit-button").click();
			
			// check if it was successful
			if(result == actionString && clicked){
				// need to wait again for slack's scripts to realize the textbox is empty
				setTimeout(function(){
					$("#submit-button").remove();
					chrome.runtime.sendMessage({message: "success-slack", closeTab: closeTab});
				}, 50);
				
			}else{
				chrome.runtime.sendMessage({message: "error-slack", closeTab: closeTab});
			}
		}, 50);
		
	}, 2000);
});

chrome.runtime.onMessage.addListener(function(request, sender){
	if(request.message == "clock-in"){
		actionString = "Here for " + hourNow + " ~";
	}else if(request.message == "clock-out"){
		actionString = "Clocking out ~";
		closeTab = true;
	}
});
