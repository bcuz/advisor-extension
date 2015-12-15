
function renderSidePanel(data) {

	var side_panel = 
	`		
	<style>
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
	#side-panel div {
		padding: 3% 4%;
		list-style-type: none;
		line-height: 30px;
		border-radius: 6px;
	}
	#side-panel div * {
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
	.other { display: none; }
	</style>
		<div id="whattodo">
			<div id="open-report">Open report (No submit yet)</div>
			<div id="close-side-panel">X</div>
		</div>

		<div id="data">
		<center id="user-name" style="font-size: 20px; color: #3d7eff;"><b>${data["Name"]}</b></center>
		<input id="myName" type="hidden" value="${data['myName']}" />

		<div id="course" data-field="entry.1578101060">
			<label>Course: *</label>
			<select>
				<option value="None: Onboarding">None: Onboarding</option>
				<option value="HTML &amp; CSS">HTML &amp; CSS</option>
				<option value="Javascript">Javascript</option>
				<option value="jQuery">jQuery</option>
				<option value="Angular.JS">Angular.JS</option>
				<option value="Ruby">Ruby</option>
				<option value="Rails">Rails</option>
				<option value="Rails Auth">Rails Auth</option>
				<option value="Make a Website">Make a Website</option>
				<option value="Make an Interactive Website">Make an Interactive Website</option>
				<option value="SQL">SQL</option>
				<option value="Java">Java</option>
				<option value="Python">Python</option>
				<option value="PHP">PHP</option>
				<option value="Command Line">Command Line</option>
				<option value="Git">Git</option>
			</select>
		</div>

		<div id="summary" data-field="entry.1667357959">
			<labe>Summary: *</label>
			<textarea rows="4" cols="35">${data["Summary"]}</textarea>
		</div>

		<div id="time" data-field="entry.1272130761">
			<div>
				<label>Hours (Max. 72)</label>
				<input type="text" id="hours" />
			</div>
			<div>
				<label>Minutes</label>
				<input type="text" id="minutes" />
			</div>
			<div>
				<label>Seconds</label>
				<input type="text" id="seconds" />
			</div>
		</div>

		<div id="user-rate" data-field="entry.5170217">
			<label>Rate the learner: *</label>
			<select>
				<option value="5">5 - Very Easy</option>
				<option value="4">4 - Easy</option>
				<option value="3">3 - Neutral</option>
				<option value="2">2 - Difficult</option>
				<option value="1">1 - Very Difficult</option>
			</select>
		</div>

		<div id="user-rate-notes">
			<label>Why this rate?</label>
			<textarea rows="4" cols="35"></textarea>
		</div>


		<div id="interaction-type-user" data-field="entry.244902865">
			<label>User-initiated interaction ?</label>
			<select>
				<option value="">None</option>
				<option value="1">Bug</option>
				<option value="2">Resource Requested</option>
				<option value="3">Guidance Requested</option>
				<option value="4">User was Stuck</option>
				<option value="5">Quiz</option>
				<option value="6">Personal Project</option>
				<option value="7">Other</option>
				<input class="other" />
			</select>
		</div>

		<div id="interaction-type-advisor" data-field="entry.677684700">
			<label>Advisor-initiated interaction ?</label>
			<select>
				<option value="">None</option>
				<option value="1">Follow-up on Resource</option>
				<option value="2">Follow-up on guidance</option>
				<option value="3">Routine check-in</option>
				<option value="4">Target feedback requested</option>
				<option value="5">Other</option>
				<input class="other" />
			</select>
		</div>

		<div id="given-resource" data-field="entry.1544719003">
			<label>Added a resource? *</label>
			<select>
				<option value="2">No</option>
				<option value="1">Yes</option>
			</select>
		</div>

		<div id="any-other-comments">
			<label>Any other comments?</label>
			<textarea rows="4" cols="35"></textarea>
		</div>
		</div>

		<script>

			// Open the report in new tab, don't send it yet
			document.getElementById("open-report").addEventListener("click", function() {
				
				// Get data from the panel
				var data = {
					myName: 		   		$("#myName").val(),
					conversationURL: 		"${data['conversationURL']}",
					summary: 				$("#summary textarea").val(),
					hours: 					$("#hours").val(),
					minutes: 				$("#minutes").val(),
					seconds: 				$("#seconds").val(),
					course: 				$("#course select").val(),
					user_rate: 				$("#user-rate select").val(),
					user_rate_notes: 		$("#user-rate-notes textarea").val(),
					interaction_user: 		$("#interaction-type-user select").val(),
					interaction_user_other: $("#interaction-type-user .other").val(),
					interaction_adv: 		$("#interaction-type-advisor select").val(),
					interaction_adv_other:  $("#interaction-type-advisor .other").val(),
					given_resource: 		$("#given-resource select").val(),
					other_notes: 			$("#any-other-comments textarea").val()
				};

				// Send the data to the report filler
				chrome.runtime.sendMessage({
					message: "open_report_tab",
					data: data
				});
			});

			// Close the panel
			document.getElementById("close-side-panel").addEventListener("click", function() {
				document.getElementById("side-panel").innerHTML = "";
				console.log("closed reports panel");
			})

			// Only when "Other" is selected for Interaction types the extra reason input should appear
			$("#interaction-type-user select").change(function() {
				var extra_input = $(this).parent().children(".other");
				if ($(this).val() == "7")
					extra_input.show();
				else 
					extra_input.hide();
			});

			// Only when "Other" is selected for Interaction types the extra reason input should appear
			$("#interaction-type-advisor select").change(function() {
				var extra_input = $(this).parent().children(".other");
				if ($(this).val() == "5")
					extra_input.show();
				else 
					extra_input.hide();
			});

		</script>
	`;

	$("#side-panel").html("");
	$("#side-panel").append(side_panel);

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