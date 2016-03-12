var side_panel = {


// Contains base HTML
HTML : `
	<script>
	String.prototype.replaceAt=function(index, character) {
    	return this.substr(0, index) + character + this.substr(index+1, this.length);
	}
	</script>

	<div id="whattodo">
		<div id="open-report">Open report (No submit yet)</div>
		<div id="close-side-panel">X</div>
	</div>
`,

// Contains panel's CSS
CSS : `
	#side-panel {
		background: #f0f0f0;
		height: 100%;
		width: 27%;
		border-left: 1px solid #c9d7df;
		overflow-y: auto;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		-webkit-box-shadow: -5px 0 6px -4px black;
		box-shadow: -5px 0 6px -4px black;
	}
	#close-side-panel {
		padding: 1%;
		width: 25px;
		display: block;
		height: 30px;
		position:absolute;
		right: 0;
		top: 9px;
		z-index: 10;
		background: #c5c5c5;
		font-weight: bold;
		font-size: 1.6em;
		cursor: pointer;
		color: #000;
		text-align: center;
	}
	#whattodo {
		position: absolute;
		top: 0;
		z-index: 5;
		width: 90%;
		height: 50px;
	}
	.other { display: none; }
	#side-panel div {
		padding: 3% 4%;
		list-style-type: none;
		line-height: 30px;
		border-radius: 6px;
	}
	#side-panel div *:not(.other) {
		display: block;
	}
	#open-report {
		height: 60%;
		width: 70%;
		padding: 3%;
		background: #5577ee;
		color: white;
		font-family: sans-serif;
		cursor: pointer;
		text-align: center;
		font-size: 1.2em;
	}
	#data { margin-top: 55px; }
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
	#side-panel input[type=checkbox], #side-panel label[data-for=checkbox] {
		display: inline-block !important;
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
		if (data.minutes.length == 1) data.minutes = "0" + data.minutes;
		if (data.seconds.length == 1) data.seconds = "0" + data.seconds;

		// Send the message to open report tab
		chrome.runtime.sendMessage({
			message: "open_report_tab",
			data: data
		});
	});

	/*************  Close side panel  ***************/

	document.getElementById("close-side-panel").addEventListener("click", function() {
		document.getElementById("side-panel").innerHTML = "";
	});

	/*** Bad hacks.... Set useful default values .... **/

	$("#user_rate").val("5");
	//$("#given_resource").val("2");
	//$("#more_than_one_resource").val("2");
	$("#able_solve_issue").val("1");
	$("#panic_button").val("1");
	$("#suggestion_or_bug").val("3");
	$("#convo_type").val("1");
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


			// If text or number, put a regular input element
			case "text":
			case "number":
				fieldHTML += `<input class="${ requiredClass }" id="${ field }" type="text" value="${fieldValue}" />`;
				break;

			// If multiple selection
			case "checkbox":
				// Fix fieldvalue
				if (fieldValue == "") fieldValue = "000";

				for (option in FORM[field].Options) {
					fieldHTML += `
						<input type="checkbox" data-field="${field}" class="${ requiredClass }" value="${option}">
						<label data-for="checkbox"> ${ FORM[field].Options[option] }</label>
						<br />`;
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
				<label>${FORM[field].Label} <span style="display: inline-block; color: red;">${ requiredLabel }</span></label>
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
			<span style="color: green; float: right; font-size: 16px;">${alreadySubmitted}</span>
			${ formHTMLandJS[0] }
		</div>

		<script>
			${ formHTMLandJS[1] }
			${ side_panel.JS(dataFields) }
		</script>

		<script>
		\$("#side-panel input[type=checkbox]").change(function() {
			var value = (\$(this).prop("checked") == true) ? 1 : 0;
			var str_tmp = \$("#"+\$(this).attr("data-field")).val();
			var index = \$(this).val() - 1;
			console.log(value);
			console.log(str_tmp);
			console.log(index);
			\$("#"+\$(this).attr("data-field")).val(str_tmp.replaceAt(index, value));
		});
		</script>
	`);
},


/* Perform validation of fields */
validate: function(data) {
	var valid = true;

	// Go through elements passed in the data
	for (field in data) {

		// Map this field in the form
		var f = FORM[field];

		// Check if field has a maximum value
		if (f.Max != undefined) {
			
			// Validate against it
			switch (f.Type) {

				case "text":
				case "longText":
					if (data[field].length > f.Max) {
						console.log(`Field ${field} has more than ${f.Max} characters`);
						valid = false;
					}
					break;

				case "number":
					if (data[field] > f.Max) {
						console.log(`Field ${field} is greater than ${f.Max}. It is ${data[field]}`);
						valid = false;
					}
					break;

				default:
					break;
			}
		}

		// Always validate numbers against minimum value (default is 0)
		var minimum = (f.Min != undefined) ? f.Min : 0;
		if (f.Type == "number") {
			if (data[field] < minimum) {
				console.log(`Field ${field} is smaller than ${minimum}. It is ${data[field]}`);
				valid = false;
			}
		}


		// Check if field is required
		if (f.Required) {
			// Need to validate its minimum value
			var minimum = (f.Min != undefined) ? f.Min : 0;

			switch (f.Type) {
				case "number":
					if (data[field] < minimum) {
						console.log(`Field ${field} is smaller than ${minimum}. It is ${data[field]}`);
						valid = false;
					}
					break;

				case "text":
				case "longText":
					if (data[field].length == minimum) {
						console.log(`Field ${field} has ${minimum} characters!`);
						valid = false;
					}
					break;

				default:
					break;	
			}
		}
	}
}


}


function secondsToString(seconds) {
	var numyears = Math.floor(seconds / 31536000);
	var numdays = Math.floor((seconds % 31536000) / 86400); 
	var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
	return numyears + " years " +  numdays + " days " + numhours + " hours "
		 + numminutes + " minutes " + numseconds + " seconds";
}

$("body").append(`<div id="side-panel"><div>`);