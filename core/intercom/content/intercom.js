const $intercom = {

	// URL used for all intercom interactions
	URL_prefix: "https://app.intercom.io",

	UI_selectors: {
		app: ".app__wrapper",
		chat: ".conversation__inbox__list-wrapper",
		chatItem: ".conversation__list__item",
		userLastVisitedLink: ".test__page-activity-link",
		active: ".o__active"
	},

	// Get the currently selected chat item
	getActiveChatItem: function() {
		return $($intercom.UI_selectors.chat + ' ' + $intercom.UI_selectors.chatItem + $intercom.UI_selectors.active)
	},

	// Get the url of the selected/active chat
	getConversationURL: function() {
		return $intercom.URL_prefix + $intercom.getActiveChatItem().attr("href")
	},

	// In the currently selected chat, this takes the user name at the top
	getUserNameHeader: function() {
		return $(".conversation__card__header a[href*=\"/a/apps\"] span").html().trim()
	},

	// In the selected chat from the list of available ones (left panel)
	// This takes the user name from the selected chat
	getUserNameActiveChatItem: function() {
		return $intercom.getActiveChatItem().find(".avatar__container h3").html().trim()
	},

	// Intercom takes a bit to load a new chat, until it does the active chat item does not change
	// It's important to differentiate the clicked chat item vs the active chat item, they're not always the same
	// clickedItem must be passed as argument, so it needs to be referenced using $(this) from the caller function
	getUserNameClickedChatItem: function(clickedItem) {
		return clickedItem.find(".avatar__container h3").html().trim()
	},

	getLatestInternalNote: function() {
		return $(".conversation__part .o__admin-note .conversation__text p").last();
	},

	getUserLastVisitedLink: function() {
		return $($intercom.UI_selectors.userLastVisitedLink).attr("href");
	}
}

export default $intercom