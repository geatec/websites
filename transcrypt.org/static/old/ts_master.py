from ts_base import *

import ts_home
import ts_documentation
import ts_install
import ts_participate
import ts_gallery
import ts_play


class Master:
	def __init__ (self):
		
		# Create class for each content page
	
		self.contentObjects = [aClass (self) for aClass in (ts_home.Home, ts_documentation.Documentation)] #, ts_install, ts_participate, ts_gallery, ts_play)
				
		# Write HTML skeleton
				
		document.open ()
		document.write ('''
			<html>
				<head>
					<meta name="viewport" content="initial-scale=1 width=device-width height=device-height">
					
					<title>Transcrypt - Pyth on in the browser - Lean, fast, open!</title>
					<meta name="robots" content="index, follow">					
					<meta name="keywords" lang="nl" xml:lang="nl" content="python browser javascript compiler transpiler">
					<meta name="description" lang="nl" xml:lang="nl" content="Transcrypt: Python in the browser">
						
					<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open Sans">	
					
					<style>
						* {
							margin: 0;
							padding: 0;
							font-family: arial;
						}
						
						h1 {
							margin-top: 5;
							margin-bottom: 30;
							padding: 10;
							text-align: center;
							color: ''' + logoGreen + ''';
							background-color: ''' + panoramaPink + ''';
						}
						
						p {
							margin-top: 15;
							margin-bottom: 15;
						}
						
						img {
							display: block;
							margin: 40 auto 40 auto;
						}
						
						.lane {
							width: ''' + ('60%' if self.landscape else '94%') + ''';
							padding-left: ''' + ('20%' if self.landscape else '3%') + ''';
							padding-right: ''' + ('20%' if self.landscape else '3%') + ''';
						}
						
						.lane img {
							max-width: 100%;
						}
						
						.section {
							padding-top: 30px;
							padding-bottom: 30px;
						}
						
						.master-structure .header {
							position: fixed;
							top = 0;
							width: 100%;
							height: 15%;
							margin: 0;
							z-index: 1;
						}
						
						.master-structure .logo-bar {
							position: relative;
							width: 100%;
							height: 69%;
							background-color: ''' + darkBrown + ''';
						}
					
						.master-structure .logo {
							position: absolute;
							top: 0%;
						}
						
						.logo-red {
							color: ''' + logoRed + ''';
						}
						
						.logo-green {
							color: ''' + logoGreen + ''';
						}
						
						.logo-blue {
							color: ''' + logoBlue + ''';
						}
						
						.logo-yellow {
							color: ''' + logoYellow + ''';
						}
					
						.master-structure .logo .image {
							position: absolute;
							backgroundSize: cover;
							backgroundImage: url("illustrations/monk_transcribing.png");
						}
						
						.master-structure .logo .title {
							float: top;
							width: 500;
							font-style: italic;
							font-weight: bold;
							overflow: hidden;
						}

						.master-structure .logo .title span {
							overflow: hidden;
						}
						
						.master-structure .logo .subtitle {
							float: top;
							width: 500;
							color: ''' + white + ''';
							font-style: italic;
						}
						
						.master-structure .menu-bar {
							position: relative;
							width: 100%;
							height: 31%;
							padding: 0% 10% 0% 10%;
							color: ''' + black + ''';
							background-color: ''' + white + ''';
							box-shadow: 0px 2px 4px lightgray;
							font-family: open sans, arial, sans serif;
							font-weight: 100;
						}
						
						.master-structure .menu-bar .button {
							position: relative;
							float: left;
							overflow: hide;
							height: 100%;
							width: 13.33%;
							cursor: pointer;
							background-color: none;
						}
						
						.master-structure .menu-bar .text {
							position: relative;
							top: 30%;
							text-align: center;
						}
								
						.master-structure .fork-me {
							visibility: ''' + ('visible' if self.landscape else 'hidden') + ''' ;
						}
						
						.master-structure .fork-me img {
							margin: 0;
							padding: 0;
						}
						
						.content-structure {
							position: absolute;	/* Must be absolute, to force right top position */
							top: 15%;
							width: 100%;
							z-index: 0;
							clear: both;
						}
						
						.master-structure .footer {
							position: relative;
							background-color: ''' + darkBrown + ''';
						}
						
						.master-structure .footer .obey-padding {
							position: relative;
						}

						.master-structure .footer .prompt {
							position: absolute;
							display: inline-block;
							bottom: -10;
							left 0;
							color: ''' + logoGreen + ''';
							font-size: 80%;
						}
						
						.master-structure .footer .share {
							position: absolute;
							right: 0;
							bottom: -10;
							background-size: cover;
						}
						
						.master-structure .footer .share img {
							margin: 0;
						}					
					</style>
					<style class="master-scale"></style>
					<style class="content-layout">''' + self.contentObjects [self.menuIndex] .getLayout () + '''</style>
					<style class="content-scale"></style>
				</head>
				<body>
					<div class="fixed">
						<div class="logo-bar lane">
							<div class="logo">
								<div class="image">
								</div>
								<div class="title">
									<span class="logo-red">T</span>
									<span class="logo-yellow">r</span>
									<span class="logo-green">a</span>
									<span class="logo-blue">n</span>
									<span class="logo-red">s</span>
									<span class="logo-yellow">c</span>
									<span class="logo-green">r</span>
									<span class="logo-blue">y</span>
									<span class="logo-yellow">p</span>
									<span class="logo-green">t</span>
								</div>
								<div class="subtitle">
									Python in the browser					
								</div>
							</div>
						</div>
						<div class="menu-bar lane">
							<div class = button index0></div>
							<div class = button index1></div>
							<div class = button index2></div>
							<div class = button index3></div>
							<div class = button index4></div>
						</div>
						<div class="fork-me">
							<a href="https://github.com/JdeH/Transcrypt" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="illustrations/forkme.png" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png">
							</a>				
						</div>
						
						<div class="moving">
							<div class="sections">
							</div>
							<div class="footer lane section">	<!-- Must be inside moving to stack with other sections -->
								<div class="obey-padding">
									<div class="prompt">
										>>> Web client coding can be fun!_
									</div>
									<div class="star">
									</div>
									<div class="share">
										<a class="a2a_dd" href="https://www.addtoany.com/share?linkurl=www.transcrypt.org&amp;linkname=www.transcrypt.org">
											<img src="//static.addtoany.com/buttons/share_save_171_16.png" width="171" height="16" border="0" alt="Share"/>
										</a>
									</div>
									<div class="follow">
									</div>
									<div class="company">
									</div>
								</div>
							</div>
						</div>
					</div>
				</body>
			</html>	
		''')
		document.close ()
		
		# Prefetch frequently needed detail widgets
		
		self.masterScale = document.querySelector ('.master-scale')
		self.contentScale = document.querySelector ('.content-scale')
		self.buttons = [document.querySelector ('.master-structure .menu-bar .button.index{}'.format (i)) for i in range (len (self.buttonWideTexts))]

		# Store orientation-dependent parts
		
		self.buttonWideTexts = [text.upper () for text in ('Home', 'Documentation', 'Install', 'Participate', 'Gallery', 'Play')]
		self.buttonNarrowTexts = [text.upper () for text in ('Home','Docs', 'Install', 'Join', 'Demos', 'Play')]

		# Adapt to size
				
		window.onresize = self.adaptPage

		self.landscape = None
		self.setContent (0)


	def getScripts (self):
		return '''
			<script type="text/javascript" src="https://static.addtoany.com/menu/page.js">
				var a2a_config = a2a_config || {};
				a2a_config.linkname = "Transcrypt - Python in the browser - lean, fast, open!";
				a2a_config.linkurl = "http://www.transcrypt.org";
				a2a_config.locale = "nl";
				a2a_config.num_services = 6;
				a2a_config.prioritize = ["twitter", "facebook", "google_plus", "email", "google_gmail", "linkedin"];
			</script>
		'''
		
	def hoverButton (self, menuIndex, state):
		if state:
			if self.landscape:
				self.buttons [menuIndex] .style.backgroundColor = middleGray
			else:
				self.buttons [menuIndex] .style.backgroundColor = darkGray
		else:
			self.buttons [menuIndex] .style.backgroundColor = 'transparent'
				
	def setContent (self, menuIndex):
		self.menuIndex = menuIndex
		self.adaptPage (True)
		
	def getButtons (self):
		result = ''
		for i in range (len (self.buttonWideTexts)):
			result += '''
				<div class="button index''' + str (i) + '''"
					onmouseover="ts_master.master.hoverButton (''' + str (i) + ''', true)"
					onmouseout="ts_master.master.hoverButton (''' + str (i) + ''', false)"
					onclick="ts_master.master.setContent (''' + str (i) + ''')"
				>
					<div class="text">
						''' + (self.buttonWideTexts [i] if self.landscape else self.buttonNarrowTexts [i]) + '''
					</div>
				</div>
			'''
		return result
		
	def getStructure (self):
		return '''
		'''
		
	def getLayout (self):
		return '''

		'''
		
	def getScale (self):	
		return '''
			* {
				font-size: ''' + str ((0.014 if self.landscape else 0.025) * self.windowArea) + ''';
			}	
			
			.master-structure .logo .title {
				margin: 0 0 ''' + str ((-0.008 if self.landscape else -0.015)* self.windowArea) + ''';
			}

			.master-structure .logo .title span {
				font-size: ''' + str ((0.05 if self.landscape else 0.066) * self.windowArea) + ''';
				margin: 0 0 0 ''' + str ((-0.006 if self.landscape else -0.008)* self.windowArea) + ''';
			}
		'''
	
	def createPage (self):
		pass

		
	def adaptPage (self, forceCreate):
		self.windowWidth = min (window.innerWidth, screen.width)	# screen is needed for iOS devices
		self.windowHeight = min (window.innerHeight, screen.height)
	
		self.windowArea = Math.sqrt (self.windowHeight * self.windowWidth)
		
		self.oldLandscape = self.landscape
		self.landscape = self.windowWidth > self.windowHeight
		
		if forceCreate or self.landscape != self.oldLandscape:
			self.createPage ()
	
		self.masterScale.innerHTML = self.getScale ()
		self.contentScale.innerHTML = self.contentObjects [self.menuIndex] .getScale ()
		
master = Master ()

