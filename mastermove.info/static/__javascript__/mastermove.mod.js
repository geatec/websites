	(function () {
		var backgroundColor = 'rgb(219,229,241)';
		var normalColor = 'rgb(0,0,0)';
		var accentColor = 'rgb(0,32,96)';
		var linkColor = 'rgb(0,0,255)';
		var minHeight = 600;
		document.body.style.color = normalColor;
		document.body.style.fontFamily = 'lato, arial, sans serif';
		document.body.style.fontWeight = 300;
		document.body.style.fontSize = 24;
		document.body.style.lineHeight = '140%';
		var __iter0__ = document.querySelectorAll ('h1');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			elem.style.color = accentColor;
			elem.style.fontSize = 40;
			elem.style.marginTop = 0;
			elem.style.marginBottom = 0;
			elem.style.paddingTop = 0;
			elem.style.paddingBottom = 0;
		}
		var __iter0__ = document.querySelectorAll ('h2');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			elem.style.color = accentColor;
			elem.style.fontSize = 26;
			elem.style.marginTop = 0;
			elem.style.marginBottom = 0;
			elem.style.paddingTop = 0;
			elem.style.paddingBottom = 0;
		}
		var __iter0__ = document.querySelectorAll ('h3');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			elem.style.color = accentColor;
			elem.style.fontSize = 18;
			elem.style.marginTop = 0;
			elem.style.marginBottom = 0;
			elem.style.paddingTop = 0;
			elem.style.paddingBottom = 0;
		}
		var __iter0__ = document.getElementsByClassName ('small');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			elem.style.color = accentColor;
			elem.style.fontSize = 20;
		}
		var __iter0__ = document.querySelectorAll ('a');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			elem.style.color = linkColor;
		}
		var __iter0__ = document.querySelectorAll ('ul');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			if (elem.className == 'bulleted') {
				elem.style.listStyleType = 'square';
			}
			else {
				elem.style.listStyleType = 'none';
			}
		}
		var __iter0__ = document.querySelectorAll ('table');
		for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
			var elem = __iter0__ [__index0__];
			elem.style.fontSize = 20;
		}
		var getElementByClassName = function (parent, py_name) {
			var elements = parent.getElementsByClassName (py_name);
			if (len (elements)) {
				return elements [0];
			}
			else {
				return null;
			}
		};
		var resize = function (self) {
			var pageWidth = window.innerWidth;
			var sectionWidth = min (pageWidth, 1000);
			var sectionTop = 20;
			var sectionLeft = Math.floor ((pageWidth - sectionWidth) / 2);
			var __iter0__ = document.getElementsByClassName ('section');
			for (var __index0__ = 0; __index0__ < __iter0__.length; __index0__++) {
				var section = __iter0__ [__index0__];
				section.style.position = 'absolute';
				section.style.width = sectionWidth;
				section.style.top = sectionTop;
				section.style.left = Math.floor ((pageWidth - sectionWidth) / 2);
				section.style.backgroundColor = backgroundColor;
				var portrait = getElementByClassName (section, 'portrait');
				var text = getElementByClassName (section, 'text');
				var logo = getElementByClassName (section, 'logo');
				var flag = getElementByClassName (section, 'flag');
				text.style.position = 'relative';
				text.style.padding = '10 20 10 20';
				if (logo) {
					logo.style.position = 'absolute';
					var logoHeight = 130;
					logo.style.height = logoHeight;
					logo.style.top = -(10);
					logo.style.right = 20;
					text.style.top = 10;
					var flagHeight = 30;
					if (flag) {
						flag.style.position = 'absolute';
						flag.style.height = flagHeight;
						flag.style.bottom = 10;
						flag.style.left = 20;
					}
					if (portrait) {
						portrait.style.position = 'absolute';
						var portraitHeight = 270;
						portrait.style.height = portraitHeight;
						portrait.style.top = -(10);
						portrait.style.left = 20;
						section.style.minHeight = (portraitHeight + flagHeight) + 20;
						text.style.width = sectionWidth - 400;
						text.style.left = 310;
					}
					else {
						section.style.minHeight = logoHeight + 20;
						text.style.width = sectionWidth - 200;
					}
				}
				else {
					text.style.width = sectionWidth - 40;
				}
				sectionTop += section.offsetHeight + 40;
			}
			section.style.marginBottom = 20;
		};
		window.onresize = resize;
		document.addEventListener ('DOMContentLoaded', resize);
		document.body.style.visibility = 'visible';
		__pragma__ ('<all>')
			__all__.accentColor = accentColor;
			__all__.backgroundColor = backgroundColor;
			__all__.elem = elem;
			__all__.getElementByClassName = getElementByClassName;
			__all__.linkColor = linkColor;
			__all__.minHeight = minHeight;
			__all__.normalColor = normalColor;
			__all__.resize = resize;
		__pragma__ ('</all>')
	}) ();
