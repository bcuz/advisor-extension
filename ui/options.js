function save_options() {
  var name = document.getElementById('advisor-name').value;
  var timeBetweenScreensForm = document.getElementById('time-between-screens-form').value;
  let disable_shortcuts = document.getElementById('disable_shortcuts').checked;

  chrome.storage.sync.set({
    advisorName: name,
    timeBetweenScreensForm: timeBetweenScreensForm,
    disable_shortcuts: disable_shortcuts
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
    disable_shortcuts: true
  }, function(items) {
    document.getElementById('advisor-name').value = items.advisorName;
    document.getElementById('time-between-screens-form').value = items.timeBetweenScreensForm;
    document.getElementById('disable_shortcuts').checked = items.disable_shortcuts;
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

  $("#tabs ul li").first().addClass("active");
  $("#tabs > div").hide();
  let first_tab = $("#tabs ul li a").first().attr("href");
  $(first_tab).show();
  
  $("#tabs > ul > li > a").click(function(e){
    let tab_id = $(this).attr("href");
    $("#tabs ul li").removeClass("active");
    $(this).parent().addClass("active");
    $("#tabs > div").hide();
    $(tab_id).show();

    e.preventDefault();
    e.stopPropagation();
  })
});

