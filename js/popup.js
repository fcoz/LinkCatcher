var destination = [];
var linkText = [];
var linkHTML = '';

$(document).ready(function () {
	$('button').on('click', function() {
		$('.link-replace').html(linkHTML);
	});
});	

chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {text: "init"}, getLinks);
});

function getLinks(domContent) {
	if(domContent.destination.length !== undefined || domContent.destination.length != 0) {
		for(var i=0; i<domContent.destination.length; i++) {
			linkHTML += "<li>";
			linkHTML += "<a href='"+domContent.destination[i]+"'>"+domContent.linkText[i]+"</a>";
			linkHTML += "</li>";
		}
	}
}

