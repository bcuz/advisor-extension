var side_panel = {


// Contains base HTML
HTML : `
	<script>
	String.prototype.replaceAt=function(index, character) {
    	return this.substr(0, index) + character + this.substr(index+1, this.length);
	}
	</script>

	<div id="whattodo">
		<div id="open-report">Submit Report</div>
		<div id="close-side-panel">X</div>
	</div>
`,

// Contains panel's CSS
CSS : `
	#side-panel {
		background: #f0f0f0;
		height: 100%;
		width: 30%;
		border-left: 1px solid #c9d7df;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		-webkit-box-shadow: -5px 0 6px -4px black;
		box-shadow: -5px 0 6px -4px black;
	}
	#close-side-panel {
		width: 25%;
		display: inline-block !important;
		height: 100%;
		position:absolute;
		z-index: 10;
		background: #df4057;
		font-weight: bold;
		font-size: 1.6em;
		cursor: pointer;
		color: #000;
		text-align: center;
		line-height: 50px;
	}
	#whattodo {
		position: absolute;
		top: 0;
		z-index: 5;
		width: 100%;
		height: 50px;
	}
	.other { display: none; }
	#side-panel #data div {
		padding: 0 4%;
		list-style-type: none;
		line-height: 25px;
	}
	#side-panel div *:not(.other) {
		display: block;
	}
	#open-report {
		height: 100%;
		width: 75%;
		line-height: 50px;
		display: inline-block !important;
		background: #76c56f;
		color: white;
		font-family: sans-serif;
		cursor: pointer;
		text-align: center;
		font-size: 1.2em;
	}
	#data {
		margin-top: 65px;
		overflow-y: auto;
		height: 90%;
	}
	.required-mark {
		font-size: 13px;
    	color: red;
    	font-style: italic;
    	padding: 3% 7% 1% 7%;
    	opacity: 0.9;
	}
	#user_name {
		font-size: 20px;
		color: #3d7eff;
	}
	#side-panel input[type=checkbox], #side-panel label[data-for=checkbox],
	#side-panel input[type=radio], #side-panel label[data-for=radio] {
		display: inline-block !important;
	}
	#minutes{
		background-color: #EFA2AD;
	}
	.red{
		background-color: #EFA2AD;
	}
`,

// Contains base JS
// Keeping this as a function 'cause need to pass dynamic retrieving of panel's data on click
// I'll make it static code, like the CSS field, when i figure out how to make this more cleaner
JS : function(data) {

	return  `
	/******  Assign the click listener to open panel on click of chat thread  ******/

	document.getElementById("open-report").addEventListener("click", function() {

		// Here's the creation of the 'data' object, that retrieves the data from the form
		${ data }

		// Add the user name too
		data["user_name"] = $("#user_name").html();

		// Fix the time issue for 1 digit in minutes and seconds
		if (data.minutes.length == 1) {
			data.minutes = "0" + data.minutes;
		}
		// essentially force failing the report if no time data
		// is entered. Think the fact that on the post interaction
		// time dropdowns don't have a blank state makes things weird
		if (data.hours === "0" && data.minutes === "00") {
			 data.minutes = undefined;
			}
		data.seconds = "00";

		// Send the message to open report tab
		chrome.runtime.sendMessage({
			message: "open_report_tab",
			data: data
		});
	});

	/*************  Close side panel  ***************/

	document.getElementById("close-side-panel").addEventListener("click", function() {
		chrome.runtime.sendMessage({
        	"message": "popup",
        	"id": "start-stop"
      	});
	});

	/**************  Bad but useful hacks section  *************/

	// disable "other" field until the checkbox is clicked
	$("#other").prop("disabled", true);

	// Hack for checkboxes
	\$("#side-panel input[type=checkbox]").change(function() {
		var value = (\$(this).prop("checked") == true) ? 1 : 0;
		var str_tmp = \$("#"+\$(this).attr("data-field")).val();
		var index = \$(this).val() - 1;

		// enable and disable the "other" textbox, and switch the background color between 
		// red and default based on whether it's checked or not
		if(index == "9"){
			$("#other").prop("disabled", function(){
				return ! $(this).prop("disabled");
			});
			if($("#other").prop("disabled")){
				$("#other").val("");
				$("#other").removeClass("red");
			}else{
				$("#other").addClass("red");
			}
		}

		console.log(value);
		console.log(str_tmp);
		console.log(index);
		\$("#"+\$(this).attr("data-field")).val(str_tmp.replaceAt(index, value));
	});

	// Hack for radio buttons
	\$("#side-panel input[type=radio]").click(function() {
		$("#"+\$(this).attr("name")).val(\$(this).val());
	});

	// Set useful default values
	//$("input[name=user_rate][value=5]").click();
	//$("input[name=able_solve_issue][value=1]").click();
	//$("input[name=panic_button][value=1]").click();
	//$("input[name=suggestion_or_bug][value=3]").click();
	$("input[id=hours]").val("0");
	$("input[id=minutes]").val("0");
	$("input[name=convo_type][value=1]").click();

		// select text within time input fields on mouse click
	$("#hours, #minutes").click(function() {
			$(this).select();
		}).keypress(function() {
	// background of minutes input field stays red until
	// something is entered into hour or minutes
	// made minutes red because that's usually what will need
	// to be input
		$("#minutes").css("background-color", "#fff")
	});

	// remove the red background when text is entered
	$("#other").keypress(function(){ $(this).removeClass("red"); });



	// Another useful thing, if anything different than Code/Concept Review, Bug Report, or Personal Project is selected, check "Not a code question"
	// $("input[name=convo_type]").change(function() {
	// 	var not_code_q = $("#issue_type_2");
 //    	if ($(this).val() != 1 && $(this).val() != 4 && $(this).val() != 6) {
 //    			if (not_code_q.data('clicked') === true) {
 //    				// if not a code q is already checked, and
 //    				// another not a code q type of thing is selected
 //    				// do nothing
 //    			} else {
 //    				// clicks on not a code q checkbox, sets data to clicked
	// 				  not_code_q.data('clicked', true).click();
 //    			}
 //       } else {
 //       		if (not_code_q.data('clicked') === true) {
 //       			// if a code q IS selected, and not a code q
 //       			// is checked, unclick it, and mark it as not clicked
 //     			not_code_q.data('clicked', false).click();
 //       		}
 //       }

	// });

	`;
},

/* Render each field with its subfields */
// Used for recursive rendering, in case some fields depend on another one
renderField: function(FORM, data, extra) {

	// HTML and Javascript for each field to be rendered
	var formHTMLandJS = [ ``, `` ];

	// Go through the FORM object and fill form's HTML
	for (var field in FORM) {

		// Don't render conditions in subfields
		if (field == "Condition")
			continue;

		var fieldHTML = ``;

		// Get passed value for this field. Mark empty if undefined
		var fieldValue = (data[field] != undefined) ? data[field] : "";

		// Check if field is required
		if (FORM[field].Required) {
			var requiredLabel = "*"; var requiredClass = "required";
		}
		else {
			var requiredLabel = "";  var requiredClass = "";
		}



		// Render content based on the type of field this is
		switch (FORM[field].Type) {

			// If hidden, just need a hidden input, and continue to next field
			case "hidden":
				formHTMLandJS[0] += `<input class="${ requiredClass }" id='${ field }' type="hidden" value='${fieldValue}' />`;
				dataFields += `${field} : \$("#${ field }").val(),`;
				continue;
				break;


			// If select, need the select box with options
			case "select":
				// If this field is not required, we can include an empty option
				if (FORM[field].Required == undefined || FORM[field].Required == false)
					fieldHTML = fieldHTML + `<option value="">None</option>`;

				// Get all the options
				for (option in FORM[field].Options) {
					// If we have collected data for this field and know the value of this option, mark it here
					var test = (option === fieldValue) ? "selected" : "";
					fieldHTML += `<option value="${option}" ${test}>${FORM[field].Options[option]}</option>`;
				}

				// Put them in the select field
				fieldHTML = `<select id="${ field }" ${test}>${fieldHTML}</select>`;
				break;

			case "radio":
				// K is used to assign unique ids to each radio option, to use with its label
				var k = 0;
				for (option in FORM[field].Options) {
					fieldHTML += `<input name="${field}" id="${field}_${k}" type="radio" value="${option}">
								  <label data-for="radio" for="${field}_${k}">${FORM[field].Options[option]}</label>
								  <br />`;
					k++;
				}

				fieldHTML += `<input type="hidden" id="${field}" value="${fieldValue}" />`;
				break;

			// If text or number, put a regular input element
			case "text":
			case "number":
				fieldHTML += `<input class="${ requiredClass }" id="${ field }" type="text" value="${fieldValue}" />`;
				break;

			// If multiple selection
			case "checkbox":
				// Fix fieldvalue
				if (fieldValue == "") fieldValue = "0000000000"; // needs as many zeros as there are checkboxes it seems

				var k = 0;
				for (option in FORM[field].Options) {
					fieldHTML += `
						<input id="${field}_${k}" type="checkbox" data-field="${field}" class="${ requiredClass }" value="${option}">
						<label data-for="checkbox" for="${field}_${k}"> ${ FORM[field].Options[option] }</label>
						<br />`;
					k++;
				}

				fieldHTML += `<input type="hidden" id="${ field }" value="${fieldValue}" />`;

				break;

			// If longText, put a textarea
			case "longText":
				fieldHTML += `<textarea class="${ requiredClass }" id="${ field }" rows="4" cols="35">${fieldValue}</textarea>`;
				break;

			default:
				break;
		}

		// Render any subfields we find
		var extraHTMLandJS = [ ``, `` ];
		var extraClass = ``;

		if (FORM[field].Extra != undefined) {
			extraHTMLandJS = side_panel.renderField(FORM[field].Extra, data, true);

			// Append field's javascript to the form
			formHTMLandJS[1] += extraHTMLandJS[1] + `
				$("#${ field }").change(function() {
					if ($(this).val() == ${ FORM[field].Extra.Condition })
						$(this).parent().children(".extra").show();
					else
						$(this).parent().children(".extra").hide();
				});
			`;
		}

		// Mark this field as "extra"
		if (extra != undefined && extra == true)
			extraClass = `class="extra" style="display: none;"`;

		// Append field to the form
		formHTMLandJS[0] += `
			<div ${extraClass}>
				<label style="font-weight:bold;">${FORM[field].Label} <span style="display: inline-block; color: red;">${ requiredLabel }</span></label>
				${ fieldHTML }
				${ extraHTMLandJS[0] }
			</div>
		`;

		// Add this field into the data to be passed from panel to report
		// They'll be loaded as if they were retrieved using jquery
		// Something like this:      myName: $("#myName").val(),
		dataFields += `${field} : \$("#${ field }").val(),`;
	}

	return formHTMLandJS;
},


/* Render the panel, apply HTML, CSS and JS and render FORM*/
// Populate fields with data passed
render: function(data) {

	// Data to be retrieved from panel, used later to fill reports
	// Global 'cause it'll be modified in other functions
	dataFields = `var data = { `;

	// Recursive render of all fields and subfields in the form
	var formHTMLandJS = side_panel.renderField(NEW_FORM, data);

	// Remove trailing comma and close data object, it's full at this point
	dataFields = dataFields.substring(0, dataFields.length-1);
	dataFields += ` }; `;

	// Check if report for this user was already submitted
	var alreadySubmitted = (data["success"]) ? "Already Submitted!" : "";

	// Form HTML is ready, now render the entire thing
	$("#side-panel").html("");
	$("#side-panel").append(`
		<style>
			${ side_panel.CSS }
		</style>

		${ side_panel.HTML }
		<div id="data">
			<center id="user_name">${data["Name"]}</center>
			<h5 class="required-mark">*   Required</h5>
			<span style="color: green; text-align: center; font-size: 18px; font-weight: bold; margin-right: 10px;">${alreadySubmitted}</span>
			${ formHTMLandJS[0] }
		</div>

		<script>
			${ formHTMLandJS[1] }
			${ side_panel.JS(dataFields) }
		</script>

		<script>

		</script>
	`);

}


}


$("body").append(`<div id="side-panel"><div>`);