var regExp = "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?";
var text = [];

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.text == "init") {
			if(document.getElementById('linkcatcher')) {
				var iframe = document.getElementById('linkcatcher');
				$('body').css('-webkit-transform', '');
				iframe.parentNode.removeChild(iframe);
			} else {
				BuildIframe();
				
				var links = GetLinks();
				for(var i = 0; i < links.length; i++) {
					GetTitle(links[i]);
				}
				var html = '';
				for(var i = 0; i < links.length; i++) {
					var t = localStorage[links[i]];
					var header = '';
					
					try {
						header = CapitalizeFirstLetter($('a[href="' + links[i] + '"]')[0].innerText);
					} catch(error) {
						header = 'Undefined';
						console.log('Error reading link header ' + links[i] + '\nError Message: ' + error.message);
					}
					
					html += BuildHtml(links[i], t, header);
					localStorage.removeItem(links[i]);

				}		
				chrome.storage.local.set({'linkcatcher': html});
			}
			
			setTimeout(function() {
				$(window).scroll(function() {
					var top = $(window).scrollTop();
					$('#linkcatcher').animate({top: top}, 150, function () {});
				});
			}, 400);
		}
	}
);

function BuildIframe() {
	var iframe = document.createElement('iframe');
		iframe.setAttribute('id', 'linkcatcher');
		iframe.style.cssText = "z-index:2147483647;position:fixed;background:#FFFFFF;height: 100%;-webkit-transform:translateX(-305px);width:320px;top:"; 
		iframe.src = chrome.runtime.getURL('html/popup.html');
	
	$('body').css('-webkit-transform', 'translateX(303px)');
	$('body').prepend(iframe);
}

function GetLinks() {
	var content = $('article')[0];
	var links = content.getElementsByTagName('a');
	var validLinks = [];

	for(var i = 0; i < links.length; i++) {
		if(links[i].href.match(regExp)) {
			validLinks.push(links[i].href);
		}
	}
	for(var i = 0; i < validLinks.length;) {
		if(((i > 0) && (validLinks[i] == validLinks[i - 1])) || (validLinks[i] == document.URL) || (validLinks[i].indexOf(document.location.hostname) > -1)) {
			validLinks.splice(i, 1);
		} else {
			++i;
		}
	}
	return validLinks; 
			
}

function GetTitle(link) {
	var temp = link;
	
	$.ajax({
		url: link,
		type: "GET",
		async: true
	}).done(function (response) {
		var title = response.match(/<title>(.*?)<\/title>/);
		if(title != null) {
			localStorage[temp] = title[1];
		}
	}).fail(function() {
		localStorage[temp] = 'Title Unavailable';
	});
}

function BuildHtml(url, title, header) {
	var domain = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
	var html = " ";
	
	html += "<div class='tile-container'>";
	html += "<div class='tile-header'>";
	html += "<a class='close-tile' href='#'>[x]</a>";
	html += "<a class='tile-expand' href='#'>[-]</a>";
	html += "<h2 class='titles'>" + header + "</h2></div>";
	html += "<div class='tile-body'>";
	html += "<div class='link-title'><a class='links full-links' target='_blank' href='" + url + "'>" + title + "</a></div>";
	html += "<div class='link-domain'><a class='links' target='_blank' href='"+domain[0]+"'>"+domain[1]+"</a></div>";
	html += "</div></div>";
	
	return html;
}

function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

		

