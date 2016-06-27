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
	}

}

export default $utils