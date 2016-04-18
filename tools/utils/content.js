function ratings_url() {
	chrome.runtime.sendMessage({
		message: "url_rating",
		convoURL: document.URL
	});
}

function unassign_and_close() {
	$("div[data-content='Assign to teammate or team']").click();
	$("span.dropdown__list-item")[0].click();
	$("button.js__conversation-header__close-button").click();	
}

$("body").append(
	`<script>
		$(window).unbind("keydown");
		$(window).unbind("keypress");
		$(window).unbind("keyup");

		$(window).keydown(function(event) {

		  // Shortcut for Unassign & Close	
		  if(event.ctrlKey && event.shiftKey && event.keyCode == 85) { 
		    console.log("Hey! Ctrl+Shift+U event captured!");
		    unassign_and_close();
		    event.preventDefault();
		    event.stopPropagation();
		  }

		  // Shortcut for Ratings URL
		  else if (event.ctrlKey && event.shiftKey && event.keyCode == 82) {
		  	console.log("Hey! Ctrl+Shift+T event captured!");
		  	ratings_url();
		  	event.preventDefault();
		  	event.stopPropagation();
		  }

		  // Try to override intercom shortcuts
		  else if(event.keyCode == 103 && event.keyCode == 97) { 
		    console.log("Hey! g+a event captured!");
		    event.preventDefault();
		    event.stopPropagation(); 
		  }
		});
	 </script>`
);

// ADD RATING URL QUICK HACK AND ONE-CLIK UNASSIGN & CLOSE QUICK HACK
$(".app__wrapper").on("click", `${chatSelector} ${chatItemSelector}`, function() {
	var userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    var userNameLeftBox = this.querySelector(".avatar__container h3").innerHTML.trim();
    var interval = setInterval(function() {
    	if (userNameHeader != userNameLeftBox) {
    		userNameHeader = $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim();
    	}
    	else {
    		// Once reached this point, chat is properly loaded in screen. No need to keep the loop alive
    		clearInterval(interval);
			
			if ($('.URL-rating').length == 0) {
				$(`.inbox__conversation-controls .tabs__discrete-tab__container .u__right`)
					.append(`<a class='URL-rating quick-action' style="margin: 0 4px;"> <b>URL</b> </a>
						     <a class='unassign-and-close quick-action' style="margin: 0 2px;"> <b>U&amp;C</b> </a>`);

				$(".URL-rating").click(function() { ratings_url() });

				$(".unassign-and-close").click(function() { unassign_and_close() });
			}
		}
	}, 500);
});