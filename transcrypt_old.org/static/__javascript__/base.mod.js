	__nest__ (
		__all__,
		'base', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __name__ = 'base';
					var getRgba = function () {
						var color = tuple ([].slice.apply (arguments).slice (0));
						return 'rgba({},{},{},{})'.format.apply (null, color);
					};
					var getHex = function () {
						var color = tuple ([].slice.apply (arguments).slice (0));
						var result = '';
						var __iterable0__ = color.__getslice__ (0, 3, 1);
						for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
							var component = __iterable0__ [__index0__];
							result += hexDigits [Math.floor (component / 16)] + hexDigits [__mod__ (component, 16)];
						}
						return result;
					};
					var hexDigits = '0123456789abcdef';
					var black = getHex (0, 0, 0, 1);
					var white = getHex (255, 255, 255, 1);
					var logoRed = getHex (255, 68, 34, 1);
					var logoGreen = getHex (34, 136, 0, 1);
					var logoBlue = getHex (51, 102, 255, 1);
					var logoYellow = getHex (255, 176, 0, 1);
					var darkBrown = getHex (102, 68, 34, 1);
					var lightBrown = getHex (170, 119, 68, 1);
					var transparentLogoGreen = getRgba (34, 136, 0, 0.8);
					var veryTransparentLogoGreen = getRgba (34, 136, 0, 0.1);
					var transparentLogoBlue = getRgba (51, 102, 255, 0.7);
					var veryTransparentLogoBlue = getRgba (51, 102, 255, 0.1);
					var lightGray = getHex (245, 245, 245);
					var middleGray = getHex (231, 231, 231);
					var darkGray = getHex (208, 208, 208);
					var splashGray = getHex (90, 90, 90);
					var fixedGray = getHex (60, 60, 60);
					var panoramaPink = getHex (229, 217, 217);
					var panoramaPurple = getHex (41, 23, 23);
					var Stripe = __class__ ('Stripe', [object], {
						__module__: __name__,
						get __init__ () {return __get__ (this, function (self, colors) {
							if (typeof colors == 'undefined' || (colors != null && colors .hasOwnProperty ("__kwargtrans__"))) {;
								var colors = list ([white, lightGray]);
							};
							self.colors = colors;
							self.nColors = len (self.colors);
							self.iColor = -(1);
						});},
						get __call__ () {return __get__ (this, function (self) {
							self.iColor = __mod__ (self.iColor + 1, self.nColors);
							return self.colors [self.iColor];
						});}
					});
					var indent = function (plainText) {
						return '\n'.join ((function () {
							var __accu0__ = [];
							var __iterable0__ = plainText.py_replace ('\t', '    ').py_split ('\n');
							for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
								var line = __iterable0__ [__index0__];
								__accu0__.append ('    ' + line);
							}
							return __accu0__;
						}) ());
					};
					var encodeTags = function (plainText) {
						return plainText.py_replace ('<', '&lt;').py_replace ('>', '&gt;');
					};
					var decodeTags = function (encodedText) {
						return encodedText.py_replace ('&lt;', '<').py_replace ('&gt;', '>');
					};
					var listDemo = function (fileName, app) {
						var editModes = dict ({'html': 'htmlmixed', 'py': 'python', 'js': 'javascript', 'css': 'css', 'manifest': 'htmlmixed'});
						return ((((('\n        Code in ' + fileName) + ':\n        <textarea class="code ') + editModes [fileName.py_split ('.') [-(1)]]) + '" >') + app.readFromFile ('live/transcrypt/demos/' + fileName)) + '</textarea>\n    ';
					};
					var runDemo = function (py_name) {
						return ((((('\n        <a class="run" href="live/transcrypt/demos/' + py_name) + '/') + py_name) + '.min.html" target="_blank">\n            Run the \'') + py_name) + "' example\n        </a>\n    ";
					};
					__pragma__ ('<all>')
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
				}
			}
		}
	);
