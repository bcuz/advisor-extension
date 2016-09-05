# Toolbox for Codecademy Advisors #


### Extended version of the [Codecademy Advisor Toolbox](https://bitbucket.org/walom8868/codecademy-advisortoolbox) ###

#### My Additions: ####

1. Clock In / Out function (tools/clock-in-out)
2. Conversations per hour counter
	* Ctrl+Shift+X now performs all the old functions and also increments the counter
	* Ctrl+Shift+L just increments the counter
3. Updated the UI to include these features
4. Added link to other advisor tools

#### Changelog ####

1. Added the clock-in-out module in tools. This includes:
	* slack.js - injected by background.js into Slack to post the clock in / out message
	* login.js - injected by background.js into TrackSmart to clock in / out
	* background/background.js - handles clock in / out functions, opens / closes tabs, and stores / retrieves user data.
2. Added moment.min.js in libs - used to handle time calculations
3. Modified popup.html to include the new featues
4. Modified popup.js to handle the new UI features including:
	* Calculating and showing the conversations per hour informations
	* Call the neccessary functions when clocking in / out
5. Modified options.html to include information on how to use the added features
6. Modified tools/utils/background.js to also check for other messages and call functions accordingly
7. Minor changes to tools/utils/content/content.js to handle the new keyboard shortcuts
8. Modified manifest.json to include the new scripts

-- First commit is the original version, second shows my changes --