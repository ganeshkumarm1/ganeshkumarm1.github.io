var cbpAnimatedHeader;
cbpAnimatedHeader = (function () {

	var docElem = document.documentElement,
		header = document.querySelector('.navbar-default'),
		didScroll = false,
		changeHeaderOn = 200;
	var nav = document.querySelector('.navbar-nav');
	var brand = document.querySelector('.navbar-brand');
	var icon = document.getElementsByClassName('icon-bar')

	function init() {
		window.addEventListener('scroll', function (event) {
			if (!didScroll) {
				didScroll = true;
				setTimeout(scrollPage, 250);
			}
		}, false);
	}

	function scrollPage() {
		var sy = scrollY();
		if (sy >= changeHeaderOn) {
			classie.add(header, 'navbar-shrink');
			classie.add(nav, 'navbar-nav-shrink');
			classie.add(brand, 'navbar-brand-shrink');
			for (var i = 0; i < icon.length; i++) {
				classie.add(icon[i], 'icon-bar-shrink');
			}
		}
		else {
			classie.remove(header, 'navbar-shrink');
			classie.remove(nav, 'navbar-nav-shrink');
			classie.remove(brand, 'navbar-brand-shrink');
			for (var i = 0; i < icon.length; i++) {
				classie.remove(icon[i], 'icon-bar-shrink');
			}
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();
