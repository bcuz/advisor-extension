// Clock in/out on When I Work.
const MAX_TRIES = 20;
chrome.runtime.onMessage.addListener(function(request, sender){
	let action_string = request.message;
	let interval = null;

	// Main function
	function run(){

		// Check if user was redirected to the login page
		if(document.getElementsByClassName("login-form").length !== 0){
			chrome.runtime.sendMessage({message: 'highlight-me'});

			// notify to reinject script
			document.getElementsByClassName("btn-login")[0].addEventListener('click', function(){
				chrome.runtime.sendMessage({message: "went-to-login", action: action_string})
			});

			// tell user to login
			let el = document.createElement('h2');
			el.appendChild(document.createTextNode("Login to continue"));
			el.style.color = "#ff0000";
			document.getElementsByClassName("notice-list")[0].appendChild(el);

			// autologin if prepopulated
			// setTimeout(function(){
			// 	if(document.getElementById("login-username").value !== '' && document.getElementById("login-password").value !== ''){
			// 		document.getElementById("login-button").click();
			// 	}
			// }, 100);

		}else{

			// confirm we have the right button
			let btn_txt = document.getElementsByClassName('clock-in')[0]
							.getElementsByClassName('nav-name')[0].innerText.toLowerCase();
			let expected_txt = action_string === "clock-in" ? "clock in" : "clock out"

			if(btn_txt.includes(expected_txt)){
				// Step 1: Click the first clock in/out button
				find_and_click('controller-home', 'clock-in', step2, 0);

				/**
				 *	Step 2: Click the the button in the popup
				 *	@param btn_found {boolean} - Whether step 1 was successful
				 */
				function step2(btn_found){
					if(btn_found){
						find_and_click('buttons', 'button-kit', finalStep, 0);
					}else{
						sendMessage("error-wheniwork");
					}
				}

				/**
				 *	Final Step: Confirm that the click went through
				 *	@param btn_found {boolean} - Whether step 2 was successful
				 */
				function finalStep(btn_found){
					if(btn_found){
						confirm_click("nav-name", action_string === "clock-in" ? "clock out" : "clock in", 0)
					}else{
						sendMessage("error-wheniwork");
					}
				}

			}else{
				sendMessage("error-wheniwork");
			}			
		}		
	}

	// Wait for elements to finish loading
	let num_tries = 0;
	if(document.getElementsByClassName("login-form").length === 0 
		&& document.getElementsByClassName('clock-in').length === 0){
			interval = setInterval(function(){
				if(document.getElementsByClassName("login-form").length > 0
				 || document.getElementsByClassName('clock-in').length > 0){
					clearInterval(interval);
					run();
				}else{
					if(num_tries++ > MAX_TRIES)
						sendMessage("error-wheniwork");
				}		
			}, 200);
	}else{
		run();
	}

});

/**
 *	Find and click a button on the page. Tries to find it MAX_TRIES times, once every 250ms, before giving up
 *	@param rootEl {string} - The class of the button's ancestor
 *	@param btn {string} - The button's class
 *	@param callback {function} - A callback function
 *	@param tries {int} - How many times it has already tried to find the button
 */
function find_and_click(rootEl, btn, callback, tries){
	if(document.getElementsByClassName(rootEl).length > 0 && document.getElementsByClassName(btn).length > 0){
		document.getElementsByClassName(rootEl)[0].getElementsByClassName(btn)[0].click();
		callback(true);
	}else if(tries < MAX_TRIES){
		setTimeout(() => {
			find_and_click(rootEl, btn, callback, tries+1);
		}, 250);
	}else{
		callback(false);
	}
}

/**
 *	Confirm that the login/out went through by finding the opposite button.
 *	Tries to find it MAX_TRIES times, once every 250ms, before giving up
 *	@param className {string} - The button's class
 *	@param string {string} - The expected text of the button
 *	@param {tries} - How many times it has tried to find the button
 */
function confirm_click(className, string, tries){
	let elms = document.getElementsByClassName(className);
	let found = false;
	for(var i = 0; i < elms.length; ++i){
		if(elms[i].innerText.toLowerCase().includes(string)){
			sendMessage("success-wheniwork");
			found = true;
			break;
		}
	}
	if(!found && tries < MAX_TRIES){
		setTimeout(() => {
			confirm_click(className, string, tries+1);
		}, 250);
	}else if(!found){
		sendMessage("error-wheniwork");
	}
}

// Send a message to the background script letting it know whether clock in/out was successful.
function sendMessage(myMessage){
	chrome.runtime.sendMessage({message: myMessage});
}


