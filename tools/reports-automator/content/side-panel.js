var side_panel = {

	$panel: '', // to cache panel
	first_render: true,
	data: {},

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
			background: #dd1102;
			color: #fff;
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
			font-size: 1.2vw;
			transition: all .3s;
		}
		#open-report:hover {
			background: #7C4982;
			color: #fff;
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
	    	padding: 0 0 0 1em;
	    	opacity: 0.9;
		}
		#user_name {
			color: #000;
			font-size: 1.2vw;
			padding: 20px;
			margin: 0;
			background: #e9e9f7;
			text-align: center;
		}
		#side-panel input[type=checkbox], #side-panel label[data-for=checkbox],
		#side-panel input[type=radio], #side-panel label[data-for=radio] {
			display: inline-block !important;
		}
		#side-panel input[type=text] , #side-panel textarea, #side-panel input[type=number]{
			outline: none;
			border: none;
			border-bottom: 1px solid #9e9e9e;
			background: transparent;
			height: 1.6rem;
			width: 70%;
			font-size: 1vw;
			margin: 0 0 15px 0;
			padding: 0;
			box-shadow: none;
			transition: all 0.3s ease-in-out;
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
			transition: all linear .2s;
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
			font-size: .92vw;
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
		#side-panel input[type=text]:focus, #side-panel textarea:focus, #side-panel input[type=number]:focus{
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
			font-size: .92vw;
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
	addJS : function() { 
		/******  Assign the click listener to open panel on click of chat thread  ******/

		document.getElementById("open-report").addEventListener("click", function() {	

			// update the data object with the field values
			for(var field in side_panel.data){
				side_panel.data[field] = side_panel.$panel.find(`#${field}`).val();
			}

			// Add the convo type.
			// Loops through all checkboxes and updates the default convo_type value by inserting 
			// a 1 at the index of each checked checkbox
			let convo_type = $("#convo_type").val();
			$("#side-panel input[type=checkbox]").each(function(i) {
				if($(this).prop('checked')){
					convo_type = convo_type.replaceAt(i, 1);
				}
			});
			side_panel.data["convo_type"] = convo_type;

			// Add the user name to the data 
			side_panel.data["user_name"] = $("#user_name").attr('data-report-for');	

			// Fix the time issue for 1 digit in minutes and seconds
			if (side_panel.data.minutes.length == 1) {
				side_panel.data.minutes = "0" + side_panel.data.minutes;
			}

			// essentially force failing the report if no time data
			// is entered. Think the fact that on the post interaction
			// time dropdowns don't have a blank state makes things weird
			if (side_panel.data.hours === "0" && side_panel.data.minutes === "00") {
				 side_panel.data.minutes = undefined;
			}
			side_panel.data.seconds = "00";

			// Check if any checkboxes are checked
			if($("input:checkbox:checked").length > 0){
				var anythingChecked = true;
			}

			// Check if the report is filled out properly. 
			// Adds a "data-can-file" attribute and sets it to true or false
			// Attribute is then used by Ctrl+Shift+X handler to determine whether to close the panel and convo.
			if(side_panel.data.minutes !== undefined){
				// Send the message to open report tab
				$("#data").attr("data-can-file", "true");
				chrome.runtime.sendMessage({
					message: "open_report_tab",
					data: side_panel.data
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

		// enable and disable the "other" textbox, and switch the background color between
		// red and default based on whether it's checked or not
		$("#convo_type_10").change(function() {
			if(document.getElementById('convo_type_10').checked){
				$("#other").addClass("unchanged").removeAttr('disabled');
			}else {
				$("#other").val("").removeClass("unchanged").attr('disabled', true);
			}

		});

		// Hack for radio buttons
		side_panel.$panel.on('click', 'input[type=radio]', function() {
			$("#"+$(this).attr("name")).val($(this).val());
		});
		
		// remove the red background when text is entered
		$("#other").keypress(function(){ $(this).removeClass("unchanged"); });
	},

	/* Render each field with its subfields */
	// Used for recursive rendering, in case some fields depend on another one
	renderField: function(FORM, extra) {

		// HTML and Javascript for each field to be rendered
		var formHTMLandJS = [ ``, `` ];

		// Go through the FORM object and fill form's HTML
		for (var field in FORM) {

			// Don't render conditions in subfields
			if (field == "Condition")
				continue;

			var fieldHTML = ``;

			// Check if field is required
			if (FORM[field].Required) {
				var requiredLabel = "*"; var requiredClass = "required";
			}else {
				var requiredLabel = "";  var requiredClass = "";
			}

			// Render content based on the type of field this is
			switch (FORM[field].Type) {

				// If hidden, just need a hidden input, and continue to next field
				case "hidden":
					formHTMLandJS[0] += `<input class="${ requiredClass }" id='${ field }' type="hidden" />`;
					this.data[field] = '';
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
						fieldHTML += `<option value="${option}">${FORM[field].Options[option]}</option>`;
					}

					// Put them in the select field
					fieldHTML = `<select id="${ field }" >${fieldHTML}</select>`;
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

					fieldHTML += `<input type="hidden" id="${field}" />`;
					break;

				// If text put a regular input element
				case "text":
					fieldHTML += `<input class="${ requiredClass }" id="${ field }" type="text" />`;
					break;

				// if number put a number field
				case "number":
					let max = FORM[field].Max !== undefined ? `max=${FORM[field].Max}` : '';
					let min = FORM[field].Min !== undefined ? `min=${FORM[field].Min}` : '';
					fieldHTML += `<input class="${ requiredClass }" id="${ field }" type="number" ${max} />`;
					break;

				// If multiple selection
				case "checkbox":
					var k = 0;
					for (option in FORM[field].Options) {
						fieldHTML += `
							<input id="${field}_${k}" type="checkbox" data-field="${field}" class="${ requiredClass }" value="${option}">
							<label data-for="checkbox" for="${field}_${k}"> ${ FORM[field].Options[option] }</label>
							<br />`;
						k++;
					}
					// This stores the default convo type - A string of 0's as long as the number of checkboxes
					let num_checkboxes = Object.keys(FORM[field].Options).length;
					fieldHTML += `<input type="hidden" id="${ field }" value="${'0'.repeat(num_checkboxes)}"/>`;
					break;

				// If longText, put a textarea
				case "longText":
					fieldHTML += `<textarea class="${ requiredClass }" id="${ field }" rows="4" cols="35"></textarea>`;
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
					<label style="font-size:.91vw;color:#894994">${FORM[field].Label} <span style="display: inline-block; color: red;">${ requiredLabel }</span></label>
					${ fieldHTML }
					${ extraHTMLandJS[0] }
				</div>
			`;

			// Add this field into the data to be passed from panel to report
			// They'll later be loaded by using the field name as an input field ID
			// Something like this:      myName: $("#myName").val(),
			this.data[field] = '';
		}

		return formHTMLandJS;
	},

	// update the values in the form fields when panel is opened or convo changes
	update_values: function(data){
		// clear any data currently in the panel
		this.clear_panel();

		// update username
		this.$panel.find("#user_name").text(`Report for ${data.Name}`).attr('data-report-for', data.Name);

		// update all other fields
		for(var field in data){
			this.$panel.find(`#${field}`).val(data[field]);
		}

		// check any indicated checkboxes 
		// convo_type_i is based on the data in new_form.js -> convo_type -> options
		// If the order is changed there it has to be updaded here too
		for(var  field in data.to_check){
			if(data.to_check[field]){
				switch(field){
					case 'syntax':
						$("#convo_type_1").click();
						break;
					case 'concept':
						$("#convo_type_0").click();
						break;
					case 'onboard':
						$("#convo_type_2").click();
						break;
					case 'other':
						$("#convo_type_10").click();
						break;
					case 'ready':
						$("#convo_type_8").click();
						break;
					case 'bug':
						$("#convo_type_5").click();
						break;
					case 'personal':
						$("#convo_type_7").click();
						break;
					default:
						break;
				}
			}
		}

		// Check if report for this user was already submitted
		var alreadySubmitted = (data["success"]) ? "Already Submitted!" : "";

		// updated already submitted field
		this.$panel.find("#already_submit").text(alreadySubmitted);

		// show the panel
		this.$panel.show();

		// if other has text, remove red background
		if (data.other) {		
			$("#other").removeClass("unchanged");
		}

	
	},

	/* Render the panel, apply HTML, CSS and JS and render FORM*/
	// Populate fields with data passed
	render: function(data) {

		// To speed things up, only render the panel html, css, and js once. Then just update the 
		// values of the fields for different chats, and toggle the panel
		if(this.first_render){

			// Recursive render of all fields and subfields in the form
			var formHTMLandJS = this.renderField(NEW_FORM)

			// Form HTML is ready, now render the entire thing
			this.$panel.html("");
			this.$panel.append(`
				<style>
					${ side_panel.CSS }
				</style>

				${ side_panel.HTML }
				<div id="data">
					<p id="user_name">Report for ${data["Name"]}</p>
					<h2 id="missing-fields" style="display:none">Please fill in all required fields</h2>
					<h5 class="required-mark">*   Required</h5>
					<span id="already_submit" style="color: green; text-align: center; font-size: 18px; font-weight: bold; margin-right: 10px;"></span>
					${ formHTMLandJS[0] }
				</div>

				<script>
					${ formHTMLandJS[1] }
				</script>

			`);
			// add the JS
			this.addJS();

			// don't render again
			this.first_render = false;
		}

		// update the values of the form fields with the new data, and add them to the data object
		this.update_values(data);
	},

	// clear all data from the panel
	clear_panel: function(){
		this.$panel.find('input[type=text]').val('');
		this.$panel.find('textarea').val('');
		this.$panel.find('input[type=checkbox]').removeAttr("checked");
		this.$panel.find('input[type=radio]').removeAttr("checked");
		this.$panel.find("#missing-fields").hide();
		this.$panel.find("#already_submit").text('');
		this.$panel.find("#user_name").text('');
		this.$panel.find("#data").removeAttr("data-can-file");
	},

	// Hide and reset the panel
	hide_panel: function(){
		this.clear_panel();
		this.$panel.hide();
	}

}

$("body").append(`<div id="side-panel"><div>`);
side_panel.$panel = $("#side-panel"); // cache the panel for quicker selection