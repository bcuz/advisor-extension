const $utils = {

	// For the announcement function, show only once
	announcementShown: false,

	/**
	 *  Wait until something is loaded and ready to use it
	 */
	executeWhenReady: function(params = {executeThisFunction, condition, expectedValue, updateCondition, delay}) {
		var internalInterval = setInterval(function() {
			console.log("Condition: " + params.condition + " - Expected value: " + params.expectedValue);
			if (params.condition != params.expectedValue) {
				params.updateCondition(params);
			}
			else {
				clearInterval(internalInterval);
				params.executeThisFunction();
			}
		}, params.delay);
	},

	/**
	 *  Set a new keyboard shortcut
	 *  Any keyboard shortcut will be called using ctrl and shift by default
	 */
	 createKeyboardShortcut: function(executeThis, shortcutLetter) {
		$(window).keydown(function(event) {
		  // Create new shortcut
		  if(event.ctrlKey && event.shiftKey && event.keyCode == shortcutLetter.charCodeAt(0)) {
		    executeThis();
		    event.preventDefault();
		    event.stopPropagation();
		  }
		});
	 },

	 /**
	  *  Show an announcement window
	  */
	announcement: function(message) {
		// Show only once
		if ($utils.announcementShown) return;

		$("body").append(`
			<div id="announcement">
				<style>
				#announcement {
				    position: absolute;
				    top: 4%;
				    left: 25%;
				    height: auto;
				    width: 650px;
				    background: #e5ff8a;
				    z-index: 2;
				    padding: 2%;
				    border: 3px solid #a1a273;
				}				#close-announcement {
					font-size: 30px;
				    float: right;
				    margin: 1%;
				    background: #ff4a1b;
				    font-weight: bold;
				    padding: 2%;
				    cursor: pointer;
				}
			    </style>
			    <script>
			    $("#close-announcement").click(function() {
			    	$("#announcement").hide();
			    })
			    </script>
			    <div id="close-announcement">X</div>
			    <h2> Announcement from the AllMighty Panda Extension (Advisor Toolbox) </h2>
			    <br />
			    ${message}
			</div>
		`);

		$utils.announcementShown = true;
	}
}

export default $utils