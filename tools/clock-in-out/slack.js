
const MAX_TRIES = 20;
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
		 *	@param wait_on {string} - Selector for the element
		 *	@param do_this {function} - The function to run
		 */
		function wait_and_do(wait_on, do_this, tries = 0){
			if($(wait_on).length === 0 && !executed){
				timeout = setTimeout(function(){
					wait_and_do(wait_on, do_this, tries+1);
				}, 200);
			}else if(!executed && tries < MAX_TRIES){
				executed = true;
				clearTimeout(timeout);
				do_this();
			}else{
				chrome.runtime.sendMessage({message: "error-slack", closeTab: closeTab});
			}
		}

		// Post the message to slack
		function init(){	
			// Add a submit button to the form
			$('#msg_form').append('<input type="submit" value="" id="submit-button" style="display:none">');

			if ($('#msg_input p').length > 0) {
				$('#msg_input p').text(actionString);
			}
			var result = $('#msg_input p').text();

			// Post the message and confirm that it went through		
			function post_and_confirm(tries){
				result = $('#msg_input p').text();
				document.getElementById("submit-button").click();

				if(result === actionString && clicked){
					let text = $('#msg_input p').text();
					if(text.trim() === ""){
						$("#submit-button").remove();
						chrome.runtime.sendMessage({message: "success-slack", closeTab: closeTab});
					}else if(tries < MAX_TRIES){
						clicked = false;
						setTimeout(function(){
							post_and_confirm(tries+1);
						}, 300);
					}else{
						chrome.runtime.sendMessage({message: "error-slack", closeTab: closeTab});
					}
				}
			}
			post_and_confirm(0);
		}

		if(request.message == "clock-in"){
			actionString = "Here for " + hourNow + " ~";
			wait_and_do("#msg_input p", init);
		}else if(request.message == "clock-out"){
			actionString = "Clocking out ~";
			closeTab = true;
			wait_and_do("#msg_input p", init);
		}	
	});
});
