/*******************************************************************
 * This file defines the contents of the data and form used in the report
 * This exists so that it's easier to change form layout anytime
 *******************************************************************/

/**
 *  COURSES is used to collect the value for "course" field.
 *  The keys are the values used in report, values are the keywords to look for in user's last visited URL
 */

COURSES = {
	"HTML/CSS": ["html-css", "HZA3b", "LceTK", "y2Yjd", "9x6JW",
								"f8mcL", "zrZ6c", "TlhFi", "UuBLw", "WF0CF",
								"jNuXw", "6merh"],
	"Deploy a Website": ["deploy-a-website"],
	"JavaScript": ["javascript", "spencer-sandbox", "getting-started",
								"address-book", "objects-ii", "super-makert"],
	"Java": ["java"],
	"jQuery": ["jquery", "bay3D", "GfjC6", "v6phg", "JwhI1",
							"jtFIC"],
	"Angular.js": ["angularjs"],
	"Git": ["git"],
	"Ruby": ["ruby"],
	"Rails": ["learn-rails"],
	"Rails Authentication": ["rails-auth"],
	"Make a Website": ["make-a-website"],
	"Make an Interactive Website": ["make-an-interactive-website"],
	"SQL": ["sql"],
	"PHP": ["php", "StaFQ", "QF3Wb", "jZv2E", "8a35h", "L83Do",
					"5YvPF", "7I7Xm", "RcIEe", "ZQQ64", "bH5s3",
					"QnQrd"],
	"Python": ["python"],
	"Command Line": ["command-line"],
	"Sass": ["sass"],
	"ReactJS": ['reactjs'],
	"ReactJS": ['react'],
	"NOT A CODE QUESTION": ["subscription_billing", "path"]
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

	// panic_button: {
	// 	Label: "Did you need to use  @gobeau p0 ?",
	// 	Type: "radio",
	// 	Required: true,
	// 	formID: "5170217",
	// 	Options: {
	// 		1 : "No",
	// 		2 : "Yes"
	// 	}
	// },

	// able_solve_issue: {
	// 	Label: "Were you able to solve the user's issue?",
	// 	Type: "radio",
	// 	formID: "244902865",
	// 	Required: true,
	// 	Options: {
	// 		1: "Yes",
	// 		2: "No"
	// 	}
	// },

	// user_rate: {
	// 	Label: "How would you rate your interaction with the user?",
	// 	Type: "radio",
	// 	Required: true,
	// 	formID: "5170217",
	// 	Options: {
	// 		"5": "5 - Very Easy",
	// 		"4": "4 - Easy",
	// 		"3": "3 - Neutral",
	// 		"2": "2 - Difficult",
	// 		"1": "1 - Very Difficult"
	// 	}
	// },

	// user_rate_notes: {
	// 	Label: "Why did you choose this rating?",
	// 	Type: "longText",
	// 	formID: "1328304469"
	// },

	// suggestion_or_bug: {
	// 	Label: "Did you submit a product suggestion or bug report?",
	// 	Type: "radio",
	// 	Required: true,
	// 	formID: "5170217",
	// 	Options: {
	// 		1 : "Bug Report",
	// 		2 : "Product Suggestion",
	// 		3 : "Neither",
	// 		4 : "Both"
	// 	}
	// },

	// summary: {
	// 	Label: "Brief summary of this conversation:",
	// 	Type: "longText",
	// 	formID: "1667357959",
	// 	Required: true
	// },

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

	convo_type: {
		Label: "What did you do in this conversation?",
		Type: "checkbox",
		Required: true,
		formID: "",
		Options: {
			1: "I explained a concept",
			2: "I corrected a syntax error",
			3: "I onboarded a new user",
			4: "I directed a user on what to learn next",
			5: "I gave career or undustry advice",
			6: "I received and filed a bug report",
			7: " I received a product suggestion",
			8: "It was a Personal Project (Off-Platform)",
			9: "I re-directed to customer service",
			10: "Other"
		}
	},

	course: {
		Label: "What language did you help with?",
		Type: "select",
		Required: true,
		formID: "1578101060",
		Options: {
			"NOT A CODE QUESTION": "NOT A CODE QUESTION",
			"HTML/CSS": "HTML/CSS",
			"JavaScript": "Javascript",
			"Python": "Python",
			"Ruby": "Ruby",
			"Java": "Java",
			"SQL": "SQL",
			"SQL Business Metrics": "SQL Business Metrics",
			"jQuery": "jQuery",
			"Rails": "Rails",
			"Angular.js": "Angular.js",
			"Command Line": "Command Line",
			"Make a Website": "Make a Website",
			"Make an Interactive Website": "Make an Interactive Website",
			"PHP": "PHP",
			"Git": "Git",
			"Rails Authentication": "Rails Auth",
			"Sass": "Sass",
			"ReactJS": "ReactJS"
		}
	},

	// issue_type: {
	// 	Label: "If the user had trouble with their code, which of the following did you need to do?",
	// 	Type: "checkbox",
	// 	Required: true,
	// 	formID: "",
	// 	Options: {
	// 		1: "I reviewed a concept",
	// 		2: "I helped fix a syntax error",
	// 		3: "This wasn't a code question"
	// 	}
	// },

	other_notes: {
		Label: "Any other comments?",
		Type: "longText",
		formID: "1712191337"
	}
}