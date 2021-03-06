	(function () {
		var __name__ = '__main__';
		var Stripe = __init__ (__world__.base).Stripe;
		var __name__ = __init__ (__world__.base).__name__;
		var black = __init__ (__world__.base).black;
		var darkBrown = __init__ (__world__.base).darkBrown;
		var darkGray = __init__ (__world__.base).darkGray;
		var decodeTags = __init__ (__world__.base).decodeTags;
		var encodeTags = __init__ (__world__.base).encodeTags;
		var fixedGray = __init__ (__world__.base).fixedGray;
		var getHex = __init__ (__world__.base).getHex;
		var getRgba = __init__ (__world__.base).getRgba;
		var hexDigits = __init__ (__world__.base).hexDigits;
		var indent = __init__ (__world__.base).indent;
		var lightBrown = __init__ (__world__.base).lightBrown;
		var lightGray = __init__ (__world__.base).lightGray;
		var listDemo = __init__ (__world__.base).listDemo;
		var logoBlue = __init__ (__world__.base).logoBlue;
		var logoGreen = __init__ (__world__.base).logoGreen;
		var logoRed = __init__ (__world__.base).logoRed;
		var logoYellow = __init__ (__world__.base).logoYellow;
		var middleGray = __init__ (__world__.base).middleGray;
		var panoramaPink = __init__ (__world__.base).panoramaPink;
		var panoramaPurple = __init__ (__world__.base).panoramaPurple;
		var runDemo = __init__ (__world__.base).runDemo;
		var splashGray = __init__ (__world__.base).splashGray;
		var transparentLogoBlue = __init__ (__world__.base).transparentLogoBlue;
		var transparentLogoGreen = __init__ (__world__.base).transparentLogoGreen;
		var veryTransparentLogoBlue = __init__ (__world__.base).veryTransparentLogoBlue;
		var veryTransparentLogoGreen = __init__ (__world__.base).veryTransparentLogoGreen;
		var white = __init__ (__world__.base).white;
		var All = __class__ ('All', [object], {
			__module__: __name__,
			get __init__ () {return __get__ (this, function (self, subjectName) {
				self.subjectName = subjectName;
				self.subjectNames = list (['home', 'documentation', 'examples', 'download', 'contribute', 'gallery']);
				self.menuIndex = self.subjectNames.index (self.subjectName) - 1;
				self.landscapeButtonTexts = list (['DOCUMENTATION', 'SAMPLE CODE', 'DOWNLOAD', 'PARTICIPATE', 'GALLERY']);
				self.portraitButtonTexts = list (['DOCS', 'SAMPLES', 'GET IT', 'JOIN', 'GALLERY']);
				
				            self.retina = navigator.userAgent.match (/iPhone|iPad|iPod|Android/i) != null;
				            self.safari = /^((?!Chrome|Android|CriOS).)*Safari/i.test(navigator.userAgent);
				        
				if (self.retina && !(self.safari)) {
					self.initialDevicePixelRatio = window.devicePixelRatio;
				}
				self.accessibilityZoomThreshold = 1.3;
				self.all = document.querySelector ('*');
				self.body = document.querySelector ('body');
				self.html = document.querySelector ('html');
				self.lanes = list (document.querySelectorAll ('.lane'));
				self.fixed = document.querySelector ('.fixed');
				self.logoBar = document.querySelector ('.fixed .logo-bar');
				self.logo = document.querySelector ('.fixed .logo');
				self.logoImage = document.querySelector ('.fixed .logo img');
				self.logoTitle = document.querySelector ('.fixed .logo .title');
				self.logoTitleSpans = list (document.querySelectorAll ('.fixed .logo .title span'));
				self.logoSubtitle = document.querySelector ('.fixed .logo .subtitle');
				self.forkMe = document.querySelector ('.fixed .fork-me');
				self.menuBar = document.querySelector ('.fixed .menu-bar');
				self.buttons = list (document.querySelectorAll ('.fixed .menu-bar .button'));
				self.buttonTexts = list (document.querySelectorAll ('.fixed .menu-bar .button .text'));
				self.moving = document.querySelector ('.moving');
				self.movingTargets = list (document.querySelectorAll ('.moving .target'));
				if (self.subjectName == 'home') {
					self.splash = document.querySelector ('.moving .splash');
					self.announcementBar = document.querySelector ('.moving .announcement-bar');
					self.panorama = document.querySelector ('.moving .panorama');
					self.slogan = document.querySelector ('.moving .panorama .slogan');
					self.summaryDivs = list (document.querySelectorAll ('.moving .summary div'));
				}
				self.prompt = document.querySelector ('.moving .footer .prompt');
				self.share = document.querySelector ('.moving .footer .share');
				self.html.style.visibility = 'visible';
				self.onResize (self, true);
				window.onresize = (function __lambda__ (event) {
					return self.onResize ();
				});
				window.onscroll = (function __lambda__ (event) {
					return self.onResize ();
				});
				self.logo.onclick = (function __lambda__ () {
					return self.onPressButton (-(1));
				});
				var __iterable0__ = enumerate (self.buttons);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var __left0__ = __iterable0__ [__index0__];
					var index = __left0__ [0];
					var button = __left0__ [1];
					button.onmouseover = (function __lambda__ (i) {
						return (function __lambda__ () {
							return self.onHoverButton (i, true);
						});
					}) (index);
					button.onmouseout = (function __lambda__ (i) {
						return (function __lambda__ () {
							return self.onHoverButton (i, false);
						});
					}) (index);
					button.onclick = (function __lambda__ (i) {
						return (function __lambda__ () {
							return self.onPressButton (i);
						});
					}) (index);
					button.style.backgroundColor = (index == self.menuIndex ? middleGray : 'transparent');
				}
				var __iterable0__ = list (['htmlmixed', 'python', 'javascript']);
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var editMode = __iterable0__ [__index0__];
					var __iterable1__ = list (document.querySelectorAll ('.code.{}'.format (editMode)));
					for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
						var code = __iterable1__ [__index1__];
						var editor = CodeMirror.fromTextArea (code, dict ({'mode': dict ({'name': editMode, 'version': 3, 'singleLineStringErrors': false}), 'lineWrapping': true, 'readOnly': true}));
						var charWidth = editor.defaultCharWidth ();
						var renderLine = function (cm, line, elt) {
							var off = CodeMirror.countColumn (line.text, null, cm.getOption ('tabSize')) * charWidth;
							elt.style.textIndent = ('-' + off) + 'px';
							elt.style.paddingLeft = (4 + off) + 'px';
						};
						editor.on ('renderLine', renderLine);
						editor.setValue (indent (decodeTags (code.innerHTML)));
					}
				}
			});},
			get getZoomFactor () {return __get__ (this, function (self) {
				if (self.retina) {
					if (self.safari) {
						var result = document.body.clientWidth / window.innerWidth;
					}
					else {
						var result = window.devicePixelRatio / self.initialDevicePixelRatio;
					}
				}
				else {
					var result = window.devicePixelRatio;
				}
				return min (result, 3);
			});},
			get onResize () {return __get__ (this, function (self, initial) {
				self.windowWidth = window.innerWidth;
				self.windowHeight = window.innerHeight;
				self.windowArea = Math.sqrt (self.windowHeight * self.windowWidth);
				if (initial) {
					self.initialWindowArea = self.windowArea;
				}
				try {
					self.oldLandscape = self.landscape;
				}
				catch (__except0__) {
					// pass;
				}
				self.landscape = self.windowWidth > self.windowHeight;
				try {
					self.oldZoomFactor = self.zoomFactor;
				}
				catch (__except0__) {
					// pass;
				}
				self.zoomFactor = self.getZoomFactor ();
				try {
					self.oldWideLaneInLandscape = self.wideLaneInLandscape;
				}
				catch (__except0__) {
					// pass;
				}
				self.wideLaneInLandscape = self.zoomFactor > self.accessibilityZoomThreshold || self.retina;
				if (initial || self.landscape != self.oldLandcape || self.zoomFactor != self.oldZoomFactor || self.wideLaneInLandscape != self.oldWideLaneInLandscape) {
					self.reorient ();
					self.oldLandscape = self.landscape;
					self.oldZoomFactor = self.zoomFactor;
					self.oldWideLaneInLandscape = self.wideLaneInLandscape;
				}
				if (self.retina) {
					if (self.safari) {
						self.allFontSize = ((1.3 * self.zoomFactor) * (self.landscape ? 0.014 : 0.025)) * self.windowArea;
					}
					else {
						self.allFontSize = ((1.3 * self.zoomFactor) * (self.landscape ? 0.025 : 0.025)) * self.initialWindowArea;
					}
				}
				else {
					self.allFontSize = (self.zoomFactor * (self.landscape ? 0.014 : 0.025)) * self.windowArea;
				}
				self.all.style.fontSize = self.allFontSize;
				var logoBarHeightFraction = 0.1;
				var menuBarHeightFraction = 0.025 + self.zoomFactor * 0.025;
				var fixedHeightFraction = logoBarHeightFraction + menuBarHeightFraction;
				self.fixed.style.height = fixedHeightFraction * self.windowHeight;
				self.logoBar.style.height = logoBarHeightFraction * self.windowHeight;
				self.logo.style.top = 0.01 * self.windowHeight;
				self.logoImage.style.width = 0.08 * self.windowHeight;
				self.logoImage.style.height = 0.08 * self.windowHeight;
				self.logoTitle.style.left = 0.08 * self.windowHeight;
				self.logoTitle.style.top = -(0.01) * self.windowHeight;
				self.logoTitle.style.fontSize = 0.06 * self.windowHeight;
				var __iterable0__ = self.logoTitleSpans;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var logoTitleSpan = __iterable0__ [__index0__];
					logoTitleSpan.style.marginRight = -(0.02) * self.windowHeight;
				}
				self.logoSubtitle.style.left = 0.09 * self.windowHeight;
				self.logoSubtitle.style.top = 0.055 * self.windowHeight;
				self.logoSubtitle.style.fontSize = 0.021 * self.windowHeight;
				self.menuBar.style.height = menuBarHeightFraction * self.windowHeight;
				var menuBarFontSize = min (self.allFontSize, (self.retina && self.safari ? 0.1 : 0.05) * self.windowWidth, 0.04 * self.windowHeight);
				self.menuBar.style.fontSize = menuBarFontSize;
				self.moving.style.top = fixedHeightFraction * self.windowHeight;
				var __iterable0__ = self.movingTargets;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var movingTarget = __iterable0__ [__index0__];
					movingTarget.style.top = -(fixedHeightFraction) * self.windowHeight;
				}
				if (self.subjectName == 'home') {
					self.splash.style.minHeight = 0.85 * self.windowHeight;
					self.panorama.style.height = 0.35 * self.windowHeight;
					self.slogan.style.fontSize = min (2 * self.allFontSize, 0.09 * self.windowHeight);
					var __iterable0__ = self.summaryDivs;
					for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
						var summaryDiv = __iterable0__ [__index0__];
						summaryDiv.style.float = (self.landscape ? 'left' : 'top');
						summaryDiv.style.width = (self.landscape ? '29%' : '95%');
					}
				}
			});},
			get reorient () {return __get__ (this, function (self) {
				if (self.landscape && !(self.wideLaneInLandscape)) {
					var __iterable0__ = self.lanes;
					for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
						var lane = __iterable0__ [__index0__];
						lane.style.width = '60%';
						lane.style.paddingLeft = '20%';
						lane.style.paddingRight = '20%';
					}
					self.forkMe.style.visibility = (self.windowHeight > 700 ? 'visible' : 'hidden');
					var __iterable0__ = enumerate (self.buttonTexts);
					for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
						var __left0__ = __iterable0__ [__index0__];
						var index = __left0__ [0];
						var buttonText = __left0__ [1];
						buttonText.innerHTML = self.landscapeButtonTexts [index];
					}
					self.prompt.style.left = 0;
					self.prompt.style.top = 20;
					self.share.style.left = null;
					self.share.style.right = 0;
					self.share.style.top = 20;
				}
				else {
					var __iterable0__ = self.lanes;
					for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
						var lane = __iterable0__ [__index0__];
						lane.style.width = '94%';
						lane.style.paddingLeft = '3%';
						lane.style.paddingRight = '3%';
					}
					self.forkMe.style.visibility = 'hidden';
					var __iterable0__ = enumerate (self.buttonTexts);
					for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
						var __left0__ = __iterable0__ [__index0__];
						var index = __left0__ [0];
						var buttonText = __left0__ [1];
						buttonText.innerHTML = self.portraitButtonTexts [index];
					}
					self.prompt.style.left = 0;
					self.prompt.style.top = 20;
					self.share.style.left = 0;
					self.share.style.right = null;
					self.share.style.top = 50;
				}
			});},
			get onHoverButton () {return __get__ (this, function (self, menuIndex, state) {
				if (menuIndex != self.menuIndex) {
					self.buttons [menuIndex].style.backgroundColor = (state ? lightGray : 'transparent');
				}
			});},
			get onPressButton () {return __get__ (this, function (self, menuIndex) {
				self.menuIndex = menuIndex;
				window.location.href = self.subjectNames [self.menuIndex + 1];
			});}
		});
		__pragma__ ('<use>' +
			'base' +
		'</use>')
		__pragma__ ('<all>')
			__all__.All = All;
			__all__.Stripe = Stripe;
			__all__.__name__ = __name__;
			__all__.black = black;
			__all__.darkBrown = darkBrown;
			__all__.darkGray = darkGray;
			__all__.decodeTags = decodeTags;
			__all__.encodeTags = encodeTags;
			__all__.fixedGray = fixedGray;
			__all__.getHex = getHex;
			__all__.getRgba = getRgba;
			__all__.hexDigits = hexDigits;
			__all__.indent = indent;
			__all__.lightBrown = lightBrown;
			__all__.lightGray = lightGray;
			__all__.listDemo = listDemo;
			__all__.logoBlue = logoBlue;
			__all__.logoGreen = logoGreen;
			__all__.logoRed = logoRed;
			__all__.logoYellow = logoYellow;
			__all__.middleGray = middleGray;
			__all__.panoramaPink = panoramaPink;
			__all__.panoramaPurple = panoramaPurple;
			__all__.runDemo = runDemo;
			__all__.splashGray = splashGray;
			__all__.transparentLogoBlue = transparentLogoBlue;
			__all__.transparentLogoGreen = transparentLogoGreen;
			__all__.veryTransparentLogoBlue = veryTransparentLogoBlue;
			__all__.veryTransparentLogoGreen = veryTransparentLogoGreen;
			__all__.white = white;
		__pragma__ ('</all>')
	}) ();
