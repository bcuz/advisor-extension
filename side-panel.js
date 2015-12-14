
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

	#side-panel div {
		padding: 10% 40%;
		list-style-type: none;
	}
	</style>
		<div id="hours" data-field="entry.1272130761_hour">

		</div>
		<div id="minutes" data-field="entry.1272130761_minute">

		</div>
		<div id="seconds" data-field="entry.1272130761_second">

		</div>
		<div id="course" data-field="entry.1578101060">
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
		<div id="easiness" data-field=>
			<select>
				<option value="5">5</option>
				<option value="4">4</option>
				<option value="3">3</option>
				<option value="2">2</option>
				<option value="1">1</option>
			</select>
		</div>
		<div id="user-interaction">
			<select>
				<option value="1">Bug</option>
				<option value="2">Resource Requested</option>
				<option value="3">Guidance</option>
				<option value="4">User was Stuck</option>
				<option value="5">Quiz</option>
				<option value="6">Personal Project</option>
				<option value="7">Other</option>
			</select>
		</div>
		<div id="given-resource" data-field="entry.1544719003">
			<select>
				<option value="1">Yes</option>
				<option value="2">No</option>
			</select>
		</div>
		<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
		<script>

			function secondsToString(seconds) {
				var numyears = Math.floor(seconds / 31536000);
				var numdays = Math.floor((seconds % 31536000) / 86400); 
				var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
				var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
				var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
				return numyears + " years " +  numdays + " days " + numhours + " hours "
					 + numminutes + " minutes " + numseconds + " seconds";
			}

		</script>
	`;

	$("#side-panel").append(side_panel);

}

$("body").append(`<div id="side-panel"><div>`);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.message == "side-panel") {
			console.log("Received side panel message - " + request.enabled);
			if (request.enabled == "true")
				renderSidePanel(null);
			else
				$("#side-panel").html("");
		}
	}
);