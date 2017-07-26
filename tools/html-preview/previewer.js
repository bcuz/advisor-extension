const btn_css = ` 
	#preview-btn {
		color: #fff;
		background-color: #7e61ea;
		background-image: linear-gradient(-180deg, #7e61ea 0%, #573faf 90%);
	}

	#preview-btn:hover {
		background-color: #573faf;
		background-image: linear-gradient(-180deg, #573faf 0%, #4e31b7 90%);
	}

	#preview-btn:focus {
		box-shadow: 0 0 0 0.2em rgba(78, 49, 183, 0.3);
	}
	
	.flash_me {
	 	animation: flash 1.5s linear infinite;
	}

	@keyframes flash {  
	  50% { opacity: 0; }
	}
`;

// Add Preview button to Github projects that have an index.html file
function github_preview(){
	let files = document.querySelectorAll('tr.js-navigation-item .content a');
	for(let i = 0; i < files.length; ++i){

		if(files[i].href.includes('index.html')){
			let a = document.createElement('a');
			a.setAttribute('class', 'btn btn-sm btn-primary tooltipped tooltipped-s');
			a.setAttribute('target', '_blank');
			a.setAttribute("id", "preview-btn");
			a.setAttribute('aria-label', 'Preview the HTML/CSS in a new tab')
			a.href = 'https://htmlpreview.github.io/?' + files[i].href;
			a.innerHTML = 'Preview';
			let style = document.createElement('style');
			style.appendChild(document.createTextNode(btn_css));
			document.getElementsByTagName('head')[0].appendChild(style);
			document.querySelector('.file-navigation.in-mid-page').appendChild(a);
			firstTimeIntro();
			break;
		}
	}
}

// Deal with HTML/CSS preview on gist files
function gist_preview(){
	$.noConflict();
	jQuery(document).ready(function($){

		// Preview HTML/CSS in new tab
		function gen_gist_preview(){
			// Rip all HTML and CSS files from the gist and store them in variables
			let html = '', css = '';

			let files = $('.file-box');
			files.each(function(i, file){
				if($(this).find('.file').attr('id').includes('html')){
					let lines = $(this).find('td.js-file-line');
					lines.each(function(i, obj){
						html += $(this).text();
					});
				}else if($(this).find('.file').attr('id').includes('css')){
					let lines = $(this).find('td.js-file-line');
					lines.each(function(i, obj){
						css += $(this).text();
					});
				}
			});

			// Remove extra spaces and script tags
			html = html.replace(/\s\s+/g, ' ').replace(/<script.*>.*<\/script>/img, '');
			css = css.replace(/\s\s+/g, ' ');

			// Send content to background page for display
			chrome.runtime.sendMessage({message: 'open-preview', html: html, css: css});
		}

		// Add Preview button (only if there are HTML/CSS files)
		$(document).find('.file').each(function(index, file){
			if($(this).attr('id').includes('html')){
				$('head').append(`<style type="text/css">${btn_css}</style>`);
				$('.file-navigation-options').prepend('<a href="#" id="preview-btn" class="btn btn-sm btn-primary tooltipped tooltipped-s">Preview</a>');
				$('#preview-btn').attr('aria-label', 'Preview the HTML/CSS in a new tab');
				firstTimeIntro();
				return false;
			}
		});
		
		// Add Edit button to each file
		$('.file-actions').each(function(i, obj){ 
			$(this).prepend('<a href="#" id="edit-btn" class="btn btn-sm">Edit</a>');
		});

		$(document).on('click', '#preview-btn', function(e){
			gen_gist_preview();
			e.preventDefault();
		});

		// Make gists editable
		$(document).on('click', '#edit-btn', function(e){
			e.preventDefault();

			let onOff = $(this).text() === "Edit" ? true : false;
			let lines = $(this).parent().parent().parent().find('td.js-file-line');
			lines.each(function(i, obj){
				$(this).attr('contenteditable', onOff);
			});
			$(this).text(onOff === true ? "Stop Editing" : "Edit");	
		});	
	});
}

// Flash the preview button if it's the first time the user is seeing it
function firstTimeIntro(){
	chrome.storage.sync.get({'preview_first_time': true}, function(response){
		if(response.preview_first_time){
			jQuery("#preview-btn").addClass('flash_me');
			jQuery("#preview-btn").hover(function(){jQuery(this).removeClass('flash_me');});
			chrome.storage.sync.set({'preview_first_time': false});
		}
	});
}


// Figure out which page it's on
let url = document.location.href;
if(url.includes('github.com') && !url.includes('gist.github.com')){
	if(document.readyState === "complete"){
		github_preview();
	}else{
		window.onload = github_preview;
	}
}else if(url.includes('gist.github.com')){
	gist_preview();
}

			
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	switch(request.message){
		case 'preview-page':
			// Display the content
			$(function(){
				$('head').append(`<style type="text/css"> ${request.css} </style>`);
				$('body').append(request.html);
			});
			break;
		default:
			break;
	}
});

