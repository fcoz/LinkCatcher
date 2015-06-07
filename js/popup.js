$(document).ready(function() {
	
	chrome.storage.local.get('linkcatcher', function(results) {
		var html = results.linkcatcher;
		$('.sidebar-content').append(html);
		
		chrome.storage.local.remove('linkcatcher');
		chrome.storage.local.clear();
	});
	
	//Click events need to wait until iframe has been appended.
	setTimeout(function() {
		$('.close-tile').click(function() {
			$(this).parent().parent().remove();
		});
		
		$('.tile-expand').click(function() {
			if($(this).parent().parent().children().eq(1).is(':visible')) {
				$(this).parent().parent().children().eq(1).hide();
				$(this).parent().parent().css('margin-bottom', '10px');
				$(this).text('[+]');
			} else {
				$(this).parent().parent().children().eq(1).show();
				$(this).text('[-]');
			}
		});
		
		$('.open-all').click(function() {
			var urls = $('.full-links');
			for(var i = 0; i < urls.length; i++) {
				//console.log(urls[i].getAttribute('href'));
				var url = urls[i].getAttribute('href');
				window.open(url);
			}
		});
		
		if ($('#back-to-top').length) {
			var scrollTrigger = 100, 
			backToTop = function () {
				var scrollTop = $(window).scrollTop();
				if (scrollTop > scrollTrigger) {
					$('#back-to-top').addClass('show');
				} else {
					$('#back-to-top').removeClass('show');
				}
			};
			backToTop();
		
			$(window).on('scroll', function () {
				backToTop();
			});
		
			$('#back-to-top').on('click', function (e) {
				e.preventDefault();
				$('html,body').animate({
				scrollTop: 0
				}, 700);
			});
		}
	}, 100);
});

