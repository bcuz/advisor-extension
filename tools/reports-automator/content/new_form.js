
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
								"jNuXw", "6merh", "responsive-design", "learn-html", "learn-css"],
	"Deploy a Website": ["deploy-a-website"],
	"JavaScript": ["javascript", "spencer-sandbox", "getting-started",
								"address-book", "objects-ii", "super-makert", "minesweeper"],
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
	"ReactJS": ['react', 'ravenous', 'jammming'],
	"NOT A CODE QUESTION": ["subscription_billing", "path", "lrn", "account"]
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
			5: "I gave career or industry advice",
			6: "I received a bug report",
			7: " I received a product suggestion",
			8: "It was a Personal Project (Off-Platform)",
			9: "This was a conversation about Pro-Intensive material",
			10: "I re-directed to customer service",
			11: "Other"
		}
	},

	other: {
		Label: "If you selected \"Other\", please describe:",
		Type: "text",
		formID:"",
	},

	course: {
		Label: "What language did you help with?",
		Type: "select",
		Required: true,
		formID: "1578101060",
		Options: {
			"PLEASE SELECT" : "PLEASE SELECT",
			"NOT A CODE QUESTION": "NOT A CODE QUESTION",
			"Angular.js": "Angular.js",
			"Command Line": "Command Line",
			"Git": "Git",
			"HTML/CSS": "HTML/CSS",
			"Java": "Java",
			"JavaScript": "Javascript",
			"jQuery": "jQuery",
			"Make a Website": "Make a Website",
			"Make an Interactive Website": "Make an Interactive Website",
			"PHP": "PHP",
			"Python": "Python",
			"Rails": "Rails",
			"Rails Authentication": "Rails Auth",
			"ReactJS": "ReactJS",
			"Ruby": "Ruby",
			"Sass": "Sass",
			"SQL": "SQL",
			"SQL Business Metrics": "SQL Business Metrics"
		}
	},

	other_notes: {
		Label: "Any other comments?",
		Type: "longText",
		formID: "1712191337"
	}
}
