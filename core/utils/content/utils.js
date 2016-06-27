const $utils = {

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
	 }
}

export default $utils