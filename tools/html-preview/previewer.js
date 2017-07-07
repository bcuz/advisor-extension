

// Add Preview button to Github projects that have an index.html file
function github_preview(){
	let files = document.querySelectorAll('tr.js-navigation-item .content a');
	for(let i = 0; i , i < files.length; ++i){

		if(files[i].href.includes('index.html')){
			let a = document.createElement('a');
			a.setAttribute('class', 'btn btn-sm btn-primary');
			a.setAttribute('target', '_blank');
			a.href = 'https://htmlpreview.github.io/?' + files[i].href;
			a.innerHTML = 'Preview';
			a.style.backgroundColor = "#28a745";
			a.style.color = "#fff";
			document.querySelector('.file-navigation.in-mid-page').appendChild(a);
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
			// Rip all HTML, CSS, and JS files from the gist and store them in variables
			let html = '', css = '', js = '';

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

			// Remove extra spaces
			html = html.replace(/\s\s+/g, ' ');
			css = css.replace(/\s\s+/g, ' ');
			js = js.replace(/\s\s+/g, ' ');

			// Send content to background page for display
			chrome.runtime.sendMessage({message: 'open-preview', html: html, css: css, js: js});
		}

		// Add Preview button (only if there are HTML/CSS files)
		if($(document).find('.file').attr('id').includes('html')){
			$('.file-navigation-options').prepend('<a href="#" id="preview-btn" class="btn btn-sm btn-primary">Preview</a>');
		}
		
		// Add Edit button to each file
		$('.file-actions').each(function(i, obj){ 
			$(this).prepend('<a href="#" id="edit-btn" class="btn btn-sm">Edit</a>');
		})

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

			
		})
	});
}



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

