from josmith import *

class SinglePicturePage (Page):
	def get (self):
		super () .get ()
		self.encodeAs = 'utf-8-sig'
		
		self.content = [
		'''
			<html>
				<head>
					<style>* {{margin:0px; padding:0px; border:0px}}</style>
					{jQueryClause}
					{scriptClause}
				</head>
				<body style="background-color:{darkBackgroundColor}; color:{lightForegroundColor}; text-align:center; padding:0px">
					<a href="/">
						<img class="image" src="/{}/{}.jpg" style="position:absolute">
					</a>
				</body>
			</html>
		'''.format (
			jQueryClause = self.app.jQueryClause,
			scriptClause = self.app.getScriptClause (code = r'''
				imageWidth = 0;
				imageHeight = 0;
			
				function rightSize () {
					var pageWidth = $ (window) .width ();
					var pageHeight = $ (window) .height ();
					
					var scrollbarGap = window.innerWidth - pageWidth;	// > 0 if scrollbar originally visible
					
					if (imageWidth >= pageWidth) {
						var targetWidth = pageWidth + scrollbarGap;
						var targetLeft = 0;
					}
					else {
						var targetWidth = imageWidth;
						var targetLeft = (pageWidth - imageWidth) / 2;
					}
						
					var targetHeight = imageHeight * targetWidth / imageWidth;
					
					if (targetHeight >= pageHeight) {
						var targetTop = 0;
					}
					else {
						var targetTop = (pageHeight - targetHeight) / 2;
					}
						
					$ ('.image') .css ({
						left: targetLeft,
						top: targetTop,
						width: targetWidth,
						height: targetHeight
					});
				}
						
				$ (window) .load (function () {
					imageWidth = $ ('.image') .width ();
					imageHeight = $ ('.image') .height ();
					
					rightSize ();
					$ (window) .resize (rightSize);
				});								
			'''),
			darkBackgroundColor = self.app.darkBackgroundColor,
			lightForegroundColor = self.app.lightForegroundColor,
			*self.args 			
		)]
