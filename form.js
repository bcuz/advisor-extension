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
	"HTML &amp; CSS": "html-css",
	"Javascript": "javascript",
	"jQuery": "jquery",
	"Angular.JS": "angularjs",
	"Ruby": "ruby",
	"Rails": "learn-rails",
	"Rails Auth": "rails-auth",
	"Make a Website": "make-a-website",
	"Make an Interactive Website": "make-an-interactive-website",
	"SQL": "sql",
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

FORM =
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
		Max: 72
	},

	minutes: {
		Label: "Minutes: (Use 2 digits. Example: 09)",
		Type: "number",
		formID: "1272130761",
		Max: 59
	},

	seconds: {
		Label: "Seconds: (Use 2 digits. Example: 09)",
		Type: "number",
		formID: "1272130761",
		Max: 59
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

	interaction_user: {
		Label: "User-initiated interaction?",
		Type: "select",
		formID: "244902865",
		Options: {
			1: "Bug",
			2: "Resource Requested",
			3: "Guidance Requested",
			4: "User was Stuck",
			5: "Quiz",
			6: "Personal Project",
			7: "Other"
		},
		Extra: {
			Condition: 7,
			interaction_user_other: {
				Label: "Other reason?",
				Type: "text"
			}
		}
	},

	interaction_adv: {
		Label: "Advisor-initiated interaction?",
		Type: "select",
		formID: "677684700",
		Options: {
			1: "Follow-up on Resource",
			2: "Follow-up on Guidance",
			3: "Routine check-in",
			4: "Target feedback requested",
			5: "Other"
		},
		Extra: {
			Condition: 5,
			interaction_adv_other: {
				Label: "Other reason?",
				Type: "text"
			}
		}
	},

	given_resource: {
		Label: "Added a resource?",
		Type: "select",
		Required: true,
		formID: "1544719003",
		Options: {
			"1": "Yes",
			"2": "No"
		},

		Extra: {
			Condition: 1,

			resource1_title: {
				Label: "Resource#1 Title:",
				Type: "text"
			},

			resource1_link: {
				Label: "Resource#1 Link:",
				Type: "text"
			},

			resource1_description: {
				Label: "Resource#1 Description:",
				Type: "text"
			},

			more_than_one_resource: {
				Label: "Another resource?",
				Type: "select",
				Required: true,
				Options: {
					"1": "Yes",
					"2": "No"
				},

				Extra: {
					Condition: 1,

					resource2_title: {
						Label: "Resource#2 Description",
						Type: "text"
					},
					resource2_link: {
						Label: "Resource#2 Link:",
						Type: "text"
					},

					resource2_description: {
						Label: "Resource#2 Description:",
						Type: "text"
					}
				}
			}
		}
	},

	other_notes: {
		Label: "Any other comments?",
		Type: "longText",
		formID: "1712191337"
	}
}