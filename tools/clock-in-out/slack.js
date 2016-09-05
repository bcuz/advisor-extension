// automatic "here for --" message in Slack

// figure out user's timezone, and get a time in EDT. Will have to be edited for EST
var userZone = new Date().getTimezoneOffset();
if(userZone > 240){
	userZone = userZone - 240;
}else if(userZone < 240){
	userZone = 240 - userZone;
}else if(userZone == 240){
	userZone = 0;
}
var EDTtime = moment().utcOffset(userZone);
var hour24 = EDTtime._d.getHours();
var hourNow = hour24;
if(hourNow > 12){
	hourNow -= 12;
}else if(hourNow == 0){
	hourNow = 12;
}
var minNow = EDTtime._d.getMinutes();
if(minNow > 45){
	hourNow += 1;
}

var actionString = null;
var clockInOut;
var clicked;
var closeTab = false;

$.noConflict();
jQuery(document).ready(function($){
	// listen for keypress
	$(document).on('click', '#submit-button', function(){
		clicked = true;
	});
	// dynamically add a submit button to the form, and then click it
	var button = '<input type="submit" value="Submit" id="submit-button">'
	$('#message-form').append(button);
	// post a clock in / clock out message on slack
	clockInOut = function(){
		// wait 5 seconds to give page time to finish loading
		setTimeout(function(){
			document.getElementById('message-input').value = actionString;
			var result = $('#message-input').val();
			$('#submit-button').trigger("click");
			// check if it was successful 
			if(result == actionString && clicked){
				chrome.runtime.sendMessage({message: "success-slack", closeTab: closeTab});
			}else{
				chrome.runtime.sendMessage({message: "error-slack", closeTab: closeTab});
			}
		}, 5000);
	}
	clockInOut();
});

chrome.runtime.onMessage.addListener(function(request, sender){
	if(request.message == "clock-in"){
		actionString = "Here for " + hourNow;
		closeTab = false;
	}else if(request.message == "clock-out"){
		actionString = "Clocking out";
		closeTab = true;
	}
})

