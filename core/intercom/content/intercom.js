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
		return $(".conversation__card__title a[href*=\"/a/apps\"] span").html().trim();
	},

	// In the selected chat from the list of available ones (left panel)
	// This takes the user name from the selected chat
	getUserNameActiveChatItem: function() {
		return $intercom.getActiveChatItem().find(".layout__media__ext h3").html().replace(/[<!--->]/g, '').trim();
	},

	// Intercom takes a bit to load a new chat, until it does the active chat item does not change
	// It's important to differentiate the clicked chat item vs the active chat item, they're not always the same
	// clickedItem must be passed as argument, so it needs to be referenced using $(this) from the caller function
	getUserNameClickedChatItem: function(clickedItem) {
		return clickedItem.find(".layout__media__ext h3").html().replace(/[<!--->]/g, '').trim();
	},

	getLatestInternalNote: function() {
		return $(".conversation__part .o__admin-note .conversation__text p").last();
	},

	getUserLastVisitedLink: function() {
		return $($intercom.UI_selectors.userLastVisitedLink).attr("href");
	},

	/** 
	 *	Try to get the last time the conversation was reassigned. Hopefully this is when the advisor 
  	 * 	responded to the conversation. This won't work for longer conversations / conversations with many 
  	 *	messages because the conversation__action element is no longer on the page. It also does not work 
  	 *	if someone else manually assigns the convo to another advisor.
  	 */
	getLastReassignedTime: function(){
		if($('.conversation__action div a').length > 0){ 
			// last conversation__action element. Hopefully the "replied and assigned to" one
			var timeElmt = $('.conversation__action div').last();
			// Confirm it is the right element.
			// First check for auto-assigned
			if((timeElmt.text().indexOf("replied and auto-assigned") !== -1) || 
				/* Check for advisor self assigned to themselves */
				(timeElmt.text().indexOf("assigned this conversation to") !== -1 && 
					timeElmt.find('a.js__href-to.c__deemphasized-text').text().indexOf("yourself") !== -1)) {

				return timeElmt.find('.js__overlay-opener time').attr('datetime');
			}
		}
		return null;
	}
}

export default $intercom