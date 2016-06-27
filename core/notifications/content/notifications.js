const $notifications = {
	info: function(message) {
		$.notify(message, {
			className: "info",
			globalPosition: "top center"
		});
	},

	success: function(message) {
		$.notify(message, {
			className: "success",
			globalPosition: "top center",
			hideAnimation: "slideUp",
			autoHide: true,
			autoHideDelay: 5000
		});
	},

	failure: function(message) {
		$.notify(message, {
			className: "error",
			globalPosition: "top center",
			hideAnimation: "slideUp",
			clickToHide: true,
			autoHide: false
		});
	}
}

export default $notifications