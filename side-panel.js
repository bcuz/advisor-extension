
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
		padding: 1%
		width: 30px;
		height: 30px;
		position:absolute;
		right: 0;
		top: 0;
		z-index: 10
		background: #7f7f7f;
		font-weight: strong;
		font-size: 1.6em;
		cursor: pointer;
		color: #000;
	}
	#whattodo {
		position: absolute;
		top: 0;
		z-index: 5;
		width: 90%;
		height: 50px;
	}
	#side-panel div {
		padding: 4% 5%;
		list-style-type: none;
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
	#data { margin-top: 50px; }
	</style>
		<div id="whattodo">
			<div id="open-report">Open report (No submit yet)</div>
			<div id="close-side-panel">X</div>
		</div>

		<div id="data">
		<div id="user-name" style="text-align: center;">User Name: <b>${data["Name"]}</b></div>

		<div id="summary" data-field="entry.1667357959">
			<labe>Summary:</label>
			<textarea rows="4" cols="35">${data["Summary"]}</textarea>
		</div>

		<div id="hours" data-field="entry.1272130761_hour"></div>
		<div id="minutes" data-field="entry.1272130761_minute"></div>
		<div id="seconds" data-field="entry.1272130761_second"></div>

		<div id="course" data-field="entry.1578101060">
			<label>Course:</label>
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

		<div id="user-rate" data-field="entry.5170217">
			<label>Rate the learner:</label>
			<select>
				<option value="5">5 - Very Easy</option>
				<option value="4">4 - Easy</option>
				<option value="3">3 - Neutral</option>
				<option value="2">2 - Difficult</option>
				<option value="1">1 - Very Difficult</option>
			</select>
		</div>

		<div id="user-rate-notes">
			<textarea rows="4" cols="35"></textarea>
		</div>


		<div id="interaction-type-user" data-field="entry.244902865">
			<label>User-initiated interaction ?</label>
			<select>
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
				<option value="1">Follow-up on Resource</option>
				<option value="2">Follow-up on guidance</option>
				<option value="3">Routine check-in</option>
				<option value="4">Target feedback requested</option>
				<option value="5">Other</option>
				<input class="other" />
			</select>
		</div>

		<div id="given-resource" data-field="entry.1544719003">
			<label>Added a resource?</label>
			<select>
				<option value="1">Yes</option>
				<option value="2">No</option>
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

				};

				// Send the data to the report filler
				chrome.runtime.sendMessage({
					"message": "open_report_tab",
					"myName": "${data['myName']}",
					"conversationURL": "${data['conversationURL']}",
					"summary": "${data['Summary']}"
				});
			});

			// Close the panel
			document.getElementById("close-side-panel").addEventListener("click", function() {
				document.getElementById("side-panel").innerHTML = "";
				console.log("closed reports panel");
			})

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

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message == "side-panel") {
			console.log("Received side panel message - " + request.enabled);
			console.log(interactions);
			if (request.enabled == "true")
				renderSidePanel(null);
			else
				$("#side-panel").html("");
		}
	}
);