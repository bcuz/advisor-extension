

chrome.runtime.onMessage.addListener(function(request, sender){

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
	let timeout = null;
	let executed = false;

	$.noConflict();
	jQuery(document).ready(function($){
		// listen for keypress
		$(document).on('click', '#submit-button', function(){
			clicked = true;
		});

		/**
		 *	Wait until an element is ready and then run a function
		 *
		 *	@param wait_on {string} - Selector for the element
		 *	@param do_this {function} - The function to run
		 */
		function wait_and_do(wait_on, do_this){
			if($(wait_on).length === 0 && !executed){
				timeout = setTimeout(function(){
					wait_and_do(wait_on, do_this);
				}, 150);
			}else if(!executed){
				executed = true;
				clearTimeout(timeout);
				do_this();
			}
		}

		// Post the message to slack
		function post_message(){
			console.log("called");
			// Add a submit button to the form
			$('#msg_form').append('<input type="submit" value="" id="submit-button" style="display:none">');

			if ($('#msg_input p').length > 0) {
				console.log($('#msg_input p'));
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
					}, 100);
					
				}else{
					chrome.runtime.sendMessage({message: "error-slack", closeTab: closeTab});
				}
			}, 100);
		}


		if(request.message == "clock-in"){
			actionString = "Here for " + hourNow + " ~";
			wait_and_do("#msg_input p", post_message);
		}else if(request.message == "clock-out"){
			actionString = "Clocking out ~";
			closeTab = true;
			wait_and_do("#msg_input p", post_message);
		}
		
	});

});
