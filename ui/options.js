function save_options() {
  var name = document.getElementById('advisor-name').value;
  var address = document.getElementById('advisor-address').value;
  var email = document.getElementById('advisor-email').value;
  var timeBetweenScreensForm = document.getElementById('time-between-screens-form').value;

  chrome.storage.sync.set({
    advisorName: name,
    advisorAddress: address,
    advisorEmail: email,
    timeBetweenScreensForm: timeBetweenScreensForm
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);

    // Update options in the background too
    chrome.runtime.sendMessage({
      message: "update-options"
    })
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Defaults here
  chrome.storage.sync.get({
    advisorName: '',
    timeBetweenScreensForm: "2",
    advisorEmail: '',
    advisorAddress: ''
  }, function(items) {
    document.getElementById('advisor-name').value = items.advisorName;
    document.getElementById('time-between-screens-form').value = items.timeBetweenScreensForm;
    document.getElementById('advisor-email').placeholder = items.advisorEmail !== '' ? "Saved" : '';
    document.getElementById('advisor-address').placeholder = items.advisorAddress !== '' ? "Saved" : '';
  });
}

// Sets the name and version in the options page
function set_name_and_version(){
  let manifest = chrome.runtime.getManifest();
  document.getElementById('about_details').innerHTML = manifest.name + " v" + manifest.version;
}

document.addEventListener('DOMContentLoaded', function(){restore_options(); set_name_and_version();});
document.getElementById('save').addEventListener('click',
    save_options);

// JQ code for tabs
$(function(){
  $("#tabs").tabs();
});

