// Clock in/out on When I Work.
chrome.runtime.onMessage.addListener(function(request, sender){
	let action_string = request.message;
	let interval = null;

	// Main function
	function run(){

		// Check if user was redirected to the login page
		if(document.getElementById("login-username")){
			chrome.runtime.sendMessage({message: 'highlight-me'});

			// notify to reinject script
			document.getElementById("login-button").addEventListener('click', function(){
				chrome.runtime.sendMessage({message: "went-to-login", action: action_string})
			});

			// tell user to login
			let el = document.createElement('h2');
			el.appendChild(document.createTextNode("Login to continue"));
			el.style.color = "#ff0000";
			document.getElementsByClassName("form-joined")[0].appendChild(el);

			// autologin if prepopulated
			setTimeout(function(){
				if(document.getElementById("login-username").value !== '' && document.getElementById("login-password").value !== ''){
					document.getElementById("login-button").click();
				}
			}, 100);


		}else{

			// confirm we have the right button
			let btn_txt = document.getElementsByClassName('clock-in')[0].getElementsByClassName('nav-name')[0].innerText.toLowerCase();
			let expected_txt = action_string === "clock-in" ? "clock in" : "clock out"

			if(btn_txt.includes(expected_txt)){
				// clock in / out
				find_and_click(document, 'clock-in');

				// wait for the popup to appear, and click the second button
				setTimeout(function(){
					find_and_click(document.getElementsByClassName('buttons')[0], 'button-kit');

					// wait again for the page to update, and confirm the clock in/out succeeded
					setTimeout(function(){
						if(confirm_click("nav-name", action_string === "clock-in" ? "clock out" : "clock in")){
							sendMessage("success-wheniwork");
						}else{
							sendMessage("error-wheniwork");
						}

					},500);

				},500)

			}else{
				sendMessage("error-wheniwork");
			}			
		}

		
	}

	// Wait for elements to finish loading
	if(!document.getElementById("login-username") && document.getElementsByClassName('clock-in').length === 0 && !executed){
			interval = setInterval(function(){
				if(document.getElementById("login-username") || document.getElementsByClassName('clock-in').length > 0){
					clearInterval(interval);
					run();
				}
				
			}, 200);
	}else{
		run();
	}

});

// click a button on the page
function find_and_click(rootEl, btn){
	rootEl.getElementsByClassName(btn)[0].click();
}

// Find a button with a specified string
function confirm_click(className, string){
	let elms = document.getElementsByClassName(className);
	for(var i = 0; i < elms.length; ++i){
		if(elms[i].innerText.toLowerCase().includes(string))
			return true;

	}
	return false;
}

// Send a message to the background script letting it know whether clock in/out was successful.
function sendMessage(myMessage){
	chrome.runtime.sendMessage({message: myMessage});
}


