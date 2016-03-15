/*******************************************************************
 * This file defines the contents of the data and form used in the report
 * This exists so that it's easier to change form layout anytime
 *******************************************************************/

/**
 *  COURSES is used to collect the value for "course" field.
 *  The keys are the values used in report, values are the keywords to look for in user's last visited URL
 */

// Can't figure out yet for PHP and User Onboarding
COURSES = {
	"HTML/CSS": "html-css",
	"JavaScript": "javascript",
	"jQuery": "jquery",
	"Angular.js": "angularjs",
	"Ruby": "ruby",
	"Rails": "learn-rails",
	"Rails Authentication": "rails-auth",
	"Make a Website": "make-a-website",
	"Make an Interactive Website": "make-an-interactive-website",
	"SQL": "sql",
	"PHP": "php",
	"Java": "java",
	"Python": "python",
	"Command Line": "command-line",
	"Git": "git"
}

/* Each 1st level element is a field, and has these properties:
 
 * 	Label: What's gonna be shown in the label of the field (human readable)
 *	Type:  What kind of input is this (number, text, longText, select, hidden)
 * 	Max:   Max. value field can have. If text, max is max# of characters. 
 		   If number, max numerical value. Not valid for select
 *  Min:   Min. value field can have. If text, min is min# of characters (default is 1, not empty).
 		   If number, min numerical value (default is 0). Not valid for select
 *  Required: If field is required or not. true or false
 *  Options: If field's type is select, it must have this property. Sub-object that contains options of select.
  		Example: { "value": "label" }, where "value" is value to be used in form filling, label is what user will read in screen
 * formID: ID taken directly from Google Form's HTML
 */

NEW_FORM =
{
	conversationURL: {
		Type: "hidden",
		Required: true,
		formID: "432135478"
	},

	course: {
		Label: "Course:",
		Type: "select",
		Required: true,
		formID: "1578101060",
		Options: {
			"None: Onboarding": "None: Onboarding",
			"HTML &amp; CSS": "HTML &amp; CSS",
			"Javascript": "Javascript",
			"jQuery": "jQuery",
			"Angular.JS": "Angular.JS",
			"Ruby": "Ruby",
			"Rails": "Rails",
			"Rails Auth": "Rails Auth",
			"Make a Website": "Make a Website",
			"Make an Interactive Website": "Make an Interactive Website",
			"SQL": "SQL",
			"Java": "Java",
			"Python": "Python",
			"PHP": "PHP",
			"Command Line": "Command Line",
			"Git": "Git"
		}
	},

	able_solve_issue: {
		Label: "Did you solve user's issue?",
		Type: "select",
		formID: "244902865",
		Required: true,
		Options: {
			1: "Yes",
			2: "No"
		}
	},

	user_rate: {
		Label: "Rate the learner:",
		Type: "select",
		Required: true,
		formID: "5170217",
		Options: {
			"5": "5 - Very Easy",
			"4": "4 - Easy",
			"3": "3 - Neutral",
			"2": "2 - Difficult",
			"1": "1 - Very Difficult"
		}
	},

	user_rate_notes: {
		Label: "Why this rate?",
		Type: "longText",
		formID: "1328304469"
	},

	panic_button: {
		Label: "Did you need to use panic button?",
		Type: "select",
		Required: true,
		formID: "5170217",
		Options: {
			1 : "No",
			2 : "Yes"
		}
	},

	suggestion_or_bug: {
		Label: "Product suggestion or Bug report?",
		Type: "select",
		Required: true,
		formID: "5170217",
		Options: {
			1 : "Bug Report",
			2 : "Product Suggestion",
			3 : "Neither",
			4 : "Both"
		}
	},

	summary: {
		Label: "Summary:",
		Type: "longText",
		formID: "1667357959",
		Required: true
	},

	hours: {
		Label: "Hours: (Max. 72)",
		Type: "number",
		formID: "1272130761",
		Required: true,
		Max: 72
	},

	minutes: {
		Label: "Minutes:",
		Type: "number",
		formID: "1272130761",
		Required: true,
		Max: 59
	},

	seconds: {
		Label: "Seconds:",
		Type: "number",
		formID: "1272130761",
		Required: true,
		Max: 59
	},


	convo_type: {
		Label: "Type of conversation",
		Type: "select",
		Required: true,
		formID: "677684700",
		Options: {
			1: "Code or Concept Review (Specify in Summary)",
			2: "Onboarding",
			3: "Learner Guidance (What to learn next?)",
			4: "Bug Report",
			5: "Product Suggestion",
			6: "Personal Project",
			7: "Cancellation/Account question",
			8: "Follow up",
			9: "Other (Explain in summary)"
		}
	},

	issue_type: {
		Label: "Type of Issue",
		Type: "checkbox",
		Required: true,
		formID: "",
		Options: {
			1: "Reviewed a concept",
			2: "Syntax error",
			3: "Not a code question"
		}
	},

	other_notes: {
		Label: "Any other comments?",
		Type: "longText",
		formID: "1712191337"
	}
}