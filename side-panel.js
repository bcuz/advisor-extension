var side_panel = {


// Contains base HTML
HTML : `
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
	.required {
		font-size: 13px;
    	color: red;
    	font-style: italic;
    	padding: 3% 7% 1% 7%;
    	opacity: 0.9;
	}
`,

/* Render the panel, apply HTML, CSS and JS and render FORM*/
// Populate fields with data passed
render: function(data) {
	formHTML = ``;

	// Go through the FORM object and fill form's HTML
	for (field in FORM) {
		var fieldHTML = ``;

		// Get passed value for this field. Mark empty if undefined
		var fieldValue = (data[field] != undefined) ? data[field] : "";

		// Render content based on the type of field this is
		switch (FORM[field].Type) {

			// If hidden, just need a hidden input, and continue to next field
			case "hidden":
				formHTML += `<input id='${ field }' type="hidden" value='${fieldValue}' />`;
				continue;
				break;


			// If select, need the select box with options
			case "select":
				// Get all the options
				for (option in FORM[field].Options)
					fieldHTML += `<option value="${option}">${FORM[field].Options[option]}</option>`;

				// Put them in the select field
				fieldHTML = `<select id="${ field }">${fieldHTML}</select>`;
				break;


			// If text or number, put a regular input element
			case "text":
			case "number":
				fieldHTML += `<input id="${ field }" type="text" value="${fieldValue}" />`;
				break;


			// If longText, put a textarea
			case "longText":
				fieldHTML += `<textarea id="${ field }" rows="4" cols="35">${fieldValue}</textarea>`;
				break;

			default:
				break;
		}

		// Mark if field is required
		var required = (FORM[field].Required) ? "*" : "";

		// Append field to the form
		formHTML += `
			<div>
				<label>${FORM[field].Label} <span style="display: inline-block; color: red;">${ required }</span></label>
				${ fieldHTML }
			</div>
		`;
	}

	// Form HTML is ready, now render the entire thing
	$("#side-panel").html("");
	$("#side-panel").append(`
		<style>
			${ side_panel.CSS }
		</style>
		
		${ side_panel.HTML }
		<div id="data">
			<center id="user-name" style="font-size: 20px; color: #3d7eff;"><b>${data["Name"]}</b></center>
			<h5 class="required">*   Required</h5>
			${ formHTML }
		</div>

		<script>
			${ side_panel.loadJavascript() }
		</script>
	`);
},


/* Load the Javascript for the form */
// This function exists because javascript has to be dinamically created
// so that it gets the latests contents of the form, and reduces # of lines, too long to read
loadJavascript: function() {
	var JS = ``;
	var tmp = ``;

	/***************  Assign the click listener to open panel on click of chat thread  ***************/

	// First, need to retrieve values from all the fields
	// They'll be loaded as if they were retrieved using jquery
	// Something like this:      myName: $("#myName").val(),
	for (field in FORM)
		tmp += `${field} : \$("#${ field }").val(),`;

	// Trim trailing comma
	tmp = tmp.substring(0, tmp.length-1);


	// Fields to get are loaded, not put the actual javascript
	JS += `
		// Open report tab and pass data on click
		document.getElementById("open-report").addEventListener("click", function() {
			var data = {
				${ tmp }
			};

			// Send the message to open report tab
			chrome.runtime.sendMessage({
				message: "open_report_tab",
				data: data
			});
		});
	`;


	/*************  Close side panel  ***************/
	JS += `
		document.getElementById("close-side-panel").addEventListener("click", function() {
			document.getElementById("side-panel").innerHTML = "";
		});
	`;


	/***************  Hide "Other Reason" fields  ***************/
	JS += `
		// Only when "Other" is selected for Interaction types the extra reason input should appear
		$("#interaction_user").change(function() {
			var extra_input = $("#interaction_user_other");
			if ($(this).val() == "7")
				extra_input.show();
			else 
				extra_input.hide();
		});

		// Only when "Other" is selected for Interaction types the extra reason input should appear
		$("#interaction_adv").change(function() {
			var extra_input = $("#interaction_adv_other");
			if ($(this).val() == "5")
				extra_input.show();
			else 
				extra_input.hide();
		});
	`;

	return JS;
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

/*
<div id="queue">
   On queue:
   <ul style="
    margin: 0;
">
     <li data-id="123" style="
    padding: 2px 8%;
    background: #3d7eff;
    color: white;
    cursor: pointer;
                         ">Gustavo Yacupoma  <span class="status" style="
    display: inline-block;
    float: right;
    font-weight: bold;
">WORKING</span></li>
  <li data-id="123" style="
    padding: 2px 8%;
    background: #56a033;
    color: white;
    ">Jon Samp  <span class="status" style="
    display: inline-block;
    float: right;
    font-weight: bold;
">SUCCESS</span></li>
  <li data-id="123" style="
    padding: 2px 8%;
    background: #c92739;
    color: white;
    cursor: pointer;
    ">Dan Snyder  <span class="status" style="
    display: inline-block;
    float: right;
    font-weight: bold;
    padding: 0 4%;
    background: #112233;
    ">RETRY</span></li>
   </ul>
</div>*/