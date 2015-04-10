chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.text == "init") {
			insertHtml(link());			
		}
	}
);
 
function link() {
	var allLinks = document.links;
	var destination = [];
	var linkText = [];
	
	outerloop: for(var i=0; i<allLinks.length; i++) {
		if(allLinks[i].href.match(/javascript\:/i) || allLinks[i].innerHTML == "") {
			continue;
		}
		
		for(var j=0; j<allLinks[i].childNodes.length; j++) {
			if(allLinks[i].childNodes[j].nodeName == "IMG" || allLinks[i].childNodes[j].nodeName == "SVG") {
				//decide what to do with images
				//lets just go over them
				continue outerloop;
			} else {
				continue;
			}
		}
		
		
		
		destination.push(allLinks[i].href);
		linkText.push(allLinks[i].innerHTML);
	}
	
	return {
		destination: destination,
		linkText: linkText
	};
}

function insertHtml(text) {
	var html = buildHtml(text);
	var iframe = document.createElement('iframe');
	iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
	$('body').prepend(iframe);
	
}

function buildHtml(text) {
	var html = '';
	
	html += '<div class="stop"></div>';
	html += '<div class="link-container"><ul>';
	
	//build links
	for(var i = 0; i < text.destination.length; i++) {
		html += "<li><a target='_blank' href='" + text.destination[i] + "'>" + text.linkText[i] + "</a></li>";
	}
	
	html += '</ul></div>';
	
	return html;
}
		

