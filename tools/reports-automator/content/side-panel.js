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
		<div id="close-side-panel">&#10006;</div>
	</div>
`,

// Contains panel's CSS
CSS : `
	#side-panel {
		background: #f7f7f7;
		height: 100%;
		width: 30%;
		border-left: 1px solid #ba68c8;
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		-webkit-box-shadow: -5px 0 6px -4px black;
		box-shadow: -5px 0 6px -4px black;
		z-index: 5000;
	}
	#close-side-panel {
		width: 25%;
		display: inline-block !important;
		height: 100%;
		position:absolute;
		z-index: 10;
		background: #f44336;
		font-weight: bold;
		font-size: 1.6em;
		cursor: pointer;
		color: #fff;
		text-align: center;
		line-height: 50px;
		transition: all .3s;
	}
	#close-side-panel:hover {
		background: #fff;
		color: #f44336;
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
		background: #ba68c8;
		color: white;
		font-family: sans-serif;
		cursor: pointer;
		text-align: center;
		font-size: 1.2em;
		transition: all .3s;
	}
	#open-report:hover {
		background: #fff;
		color: #ba68c8;
	}
	#data {
		margin-top: 50px;
		overflow-y: auto;
		height: 90%;
		padding-bottom: 2em;
	}
	.required-mark {
		font-size: 13px;
    	color: red;
    	font-style: italic;
    	padding: 3% 7% 1% 7%;
    	opacity: 0.9;
	}
	#user_name {
		color: #000;
		font-size: 1.2em;
		padding: 20px;
		margin: 0;
		background: #e9e9f7;
	}
	#side-panel input[type=checkbox], #side-panel label[data-for=checkbox],
	#side-panel input[type=radio], #side-panel label[data-for=radio] {
		display: inline-block !important;
	}
	#side-panel input[type=text] , #side-panel textarea{
		outline: none;
		border: none;
		border-bottom: 1px solid #9e9e9e;
		background: transparent;
		height: 1.6rem;
		width: 70%;
		font-size: 1em;
		margin: 0 0 15px 0;
		padding: 0;
		box-shadow: none;
		transition: all 0.3s;
	}
	#side-panel textarea {
		height: 80px;
	}
	#side-panel input[type="checkbox"]+label:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 15px;
		height: 15px;
		z-index: 0;
		border: 2px solid #5a5a5a;
		border-radius: 1px;
		margin-top: 4px;
		transition: all linear .3s;
	}
	#side-panel input[type="checkbox"]:not(:checked), #side-panel input[type="checkbox"]:checked {
		position: absolute;
		left: -9999px;
		opacity: 0;
		padding: 0;
	}
	#side-panel input[type="checkbox"]+label {
		position: relative;
		padding-left: 30px;
		cursor: pointer;
		font-size: .9em;
		margin-top: .1em;
	}
	#side-panel input[type="checkbox"]:checked+label:before {
		top: -4px;
		left: 0px;
		width: 8px;
		height: 18px;
		border-top: 2px solid transparent;
		border-left: 2px solid transparent;
		border-right: 2px solid  #ba68c8;
		border-bottom: 2px solid  #ba68c8;
		transform: rotate(40deg);
		backface-visibility: hidden;
		transform-origin: 100% 100%;
	}
	#side-panel input[type=text]:focus, #side-panel textarea:focus {
		border-bottom: 1px solid #ba68c8;
		box-shadow: 0 1px 0 0 #ba68c8;
	}
	#side-panel select {
		background: transparent;
		width: 70%;
		border: none;
		border-bottom: 1px solid #9e9e9e;
		border-radius: 2px;
		height: 3em;
		padding: 5px;
		font-size: .9em;
		outline: none;
	}
	.unchanged{
		background-color: #f44336 !important;
	}
	#missing-fields {
		color: #ff0000;
		margin: 1.5em auto;
		width: 100%;
		text-align: center;
		display: none;
	}
	#data div {
		margin-top: .5em;
	}
	#data::-webkit-scrollbar {
		width: 11px;
		height: 10px;
	}
	#data::-webkit-scrollbar-button {
		width: 0px;
		height: 0px;
	}
	#data::-webkit-scrollbar-thumb {
		background: #ba68c8;
		border: 1px solid #fff;
		border-radius: 10px;
	}
	#data::-webkit-scrollbar-thumb:hover {
		background: #ba68c8;
	}
	#data::-webkit-scrollbar-thumb:active {
		background: #ba68c8;
	}
	#data::-webkit-scrollbar-track {
		background: #ffffff;
		border-right: 1px solid #43d1af;
		border-left: 1px solid #43d1af;
	}
	#data::-webkit-scrollbar-track:hover {
		background: #ffffff;
	}
	#data::-webkit-scrollbar-track:active {
		background: #ffffff;
	}
	#data::-webkit-scrollbar-corner {
		background: transparent;
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
		data["user_name"] = $("#user_name").html().replace(/Report for /g, '');

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
		// Check if any checkboxes are checked
		if($("input:checkbox:checked").length > 0){
			var anythingChecked = true;
		}

		// Check if the report is filled out properly. 
		// Adds a "data-can-file" attribute and sets it to true or false
		// Attribute is then used by Ctrl+Shift+X handler to determine whether to close the panel and convo.
		if(data.minutes !== undefined && anythingChecked){
			// Send the message to open report tab
			$("#data").attr("data-can-file", "true");
			chrome.runtime.sendMessage({
				message: "open_report_tab",
				data: data
			});
			
		}else{
			// Show a warning to fill in the data
			$("#missing-fields").show();
			$("#data").attr("data-can-file", "false");
		}

	});

	/*************  Close side panel  ***************/

	document.getElementById("close-side-panel").addEventListener("click", function() {
		chrome.runtime.sendMessage({
        	"message": "popup",
        	"id": "start-stop"
      	});
	});

	/**************  Bad but useful hacks section  *************/

	// select text in minutes and hours on click
	$("#minutes, #hours").click(function(){
		$(this).select();
	})

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
				$("#other").removeClass("unchanged");
			}else{
				$("#other").addClass("unchanged");
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

	// if other has text, click other
	if ($("#other").val().length !== 0) {
		$("#convo_type_9").click()
		$("#other").removeClass("unchanged");
	}

	// remove the red background when text is entered
	$("#other").keypress(function(){ $(this).removeClass("unchanged"); });

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
				<label style="font-size:.9em;color:#894994">${FORM[field].Label} <span style="display: inline-block; color: red;">${ requiredLabel }</span></label>
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
			<center id="user_name">Report for ${data["Name"]}</center>
			<h2 id="missing-fields" style="display:none">Please fill in all required fileds</h2>
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