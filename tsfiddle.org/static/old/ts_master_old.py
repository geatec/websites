from ts_base import *

'''
import ts_home
import ts_documentation
import ts_install
import ts_participate
import ts_gallery
import ts_play
'''

class Site:
	def __init__ (self):
		self.style = document.createElement ('style')
		document.head.appendChild (self.style)
	
		self.shareScript = document.createElement ('script')
		self.shareScript.type = 'text/javascript'
		self.shareScript.innerHTML = '''
			var a2a_config = a2a_config || {};
			a2a_config.linkname = "Leer nu doelgericht wiskunde!";
			a2a_config.linkurl = "http://www.wiskundeles.com";
			a2a_config.locale = "nl";
			a2a_config.num_services = 6;
			a2a_config.prioritize = ["twitter", "facebook", "google_plus", "email", "google_gmail", "linkedin"];		
		''';
		self.shareScript.src="https://static.addtoany.com/menu/page.js"
		document.head.appendChild (self.shareScript)	
		
		self.imageDir = 'illustrations'
		self.textColor = 'ffffff'
		self.accentColor = 'ff4422'
		self.menuTextColor = '000000'
		self.menuBackgroundColor = 'ffffff'
		
		self.mailAddress = 'info@wiskunde.com'
		
		self.buttonWideTexts = [text.upper () for text in ['Home', 'Documentation', 'Install', 'Participate', 'Gallery', 'Play']]
		self.buttonNarrowTexts = [text.upper () for text in ['Home','Docs', 'Install', 'Join', 'Demos', 'Play']]
		
		self.mainTexts = [
			'''
				<table style="width:100%;">
					<tr>
						<td style="width:33%">
						</td>
						<td style="width:33%">
						</td>
						<td style="width:33%">
						</td>
					</tr>
					<tr>
						<th>
							Clean, standardized syntax
						</th>
						<th>
							Superior scalability
						</th>
						<th>
							One project, one language
						</th>
					</tr>
					<tr>
						<td>
							<p>
							Transcrypt has exactly the same clear, powerful syntax that Python is famous for, without the need for any proprietary extensions.
							
							<p>
							It supports string slicing with [i:j:k], matrix and vector operations with +, -, *, / and more, out of the box.
							
							<p>
							It compiles to compact, readable JavaScript that can be debugged from the Python source code using sourcemaps.
						</td>
						<td>
							<p>
							Python was designed for large scale programs from the ground up. Hierarchical modules, local classes and multiple inheritance are all supported by Transcrypt, allowing a flexible, yet stable overall structure.

							<p>
							Transcrypt comes integrated with a static type validator, a linter and a minifier, enabling effective cooperation of large teams on extensive projects.
						</td>
						<td>
							<p>
							Python is used everywhere at the back-end, from web servers to scientific computing. Now you can use it at the front-end as well.
							
							<p>
							Transcrypt offers seamless access to any JavaScript library and also runs on top of Node.js.
							
							<p>
							Python source code and JavaScript target code roughly have the same size, so your pages load as fast as ever.
						</td>
					</tr>
				</table>
			''',
			'''
				De wiskunde-begeleiding bestaat uit:
				<ul>
				<li>Wekelijkse les in een groep van ten hoogste vijf personen.</li>
				<li>De mogelijkheid om vragen stellen met behulp van whatsapp of mail.</li>
				<li>Twee één op één evaluatie sessies.</li>
				</ul>
				De kosten bedragen € 229,- per kwartaal.<br>
				Wij geven je graag {}
			'''.format (self.getMailLink ('meer informatie.')),
			'''
				We staan je / u graag te woord voor meer informatie:
				<ul>
				<li>Mail: {}</li>
				<li>Telefoon: 06-37143272</li>
				</ul>
			'''.format (self.getMailLink (self.mailAddress)),
			'''
				Kunnen wij iets voor uw school betekenen?
				Wilt u meer weten over onze manier van lesgeven?
				Of wilt u uw leerlingen direct goede wiskunde-begeleiding kunnen bieden?
				{}
				Wij komen graag langs voor een oriënterend gesprek.
			'''.format (self.getMailLink ('Neemt u contact met ons op.')),
			'''
				Wij kunnen u van dienst te zijn met een scala aan les- en ondersteunings-mogenlijkheden.
				Maatwerk, extra opgaven voor een bepaald onderwerp, een zomercurcus om een groep leerlingen die de stap van VMBO naar HAVO maakt een goede start te geven, of misschien wel iets waar wij nog helemaal niet aan gedacht hebben?
				{}
				Wij onderzoeken graag samen met u de mogelijkheden.
			'''.format (self.getMailLink ('Laat het ons weten.')),
			'''
				Nothing here yet.
			'''
		]
				
		self.titleContent = '''
			<font face="arial" size="10">
			<b><i><font color="{0}">T<font color="{3}">r<font color="{1}">a<font color="{2}">n<font color="{0}">s<font color="{3}">c<font color="{1}">r<font color="{2}">y<font color="{3}">p<font color="{1}">t</i></b>
		'''.format (getHex (logoRed), getHex (logoGreen), getHex (logoBlue), getHex (logoYellow))
		self.subtitleContent = '''	
			<font face="arial" color="{0}" size="3">
			<i>Python in the browser</i>
		'''.format (getHex (white))
		
		self.shareContent = '''
			<a class="a2a_dd" href="https://www.addtoany.com/share?linkurl=www.wiskundeles.com&amp;linkname=www.wiskundeles.com">
				<img src="//static.addtoany.com/buttons/share_save_171_16.png" width="171" height="16" border="0" alt="Share"/>
			</a>
		'''
				
		document.body.style.backgroundColor = getRgba (lightBrown)
		document.body.style.fontFamily = 'open sans, sans serif'
		document.body.style.overflowX = 'hidden'
						
		self.strip = document.createElement ('div')
		self.strip.style.position = 'absolute'
		self.strip.style.backgroundSize = 'cover'
		self.strip.style.backgroundPosition = 'center'
		self.strip.style.backgroundImage = 'url("{}/athens_strip.jpg")'.format (self.imageDir)
		self.strip.style.margin = 0
		document.body.appendChild (self.strip)

		self.share = document.createElement ('div')
		self.share.style.position = 'absolute'
		self.share.style.backgroundSize = 'cover'
		self.share.innerHTML = self.shareContent
		document.body.appendChild (self.share)

		self.caption = document.createElement ('div')
		self.caption.style.position = 'absolute'
		self.caption.style.padding = '0 65 2 60'
		self.caption.style.color = getRgba (black)
		self.caption.style.fontFamily = 'open sans, sans serif'		
		self.caption.style.fontStyle = 'italic'
		self.caption.style.fontWeight = 700
		self.strip.appendChild (self.caption)
		
		self.mainText = document.createElement ('div')
		self.mainText.margin = 0
		self.mainText.style.position = 'absolute'
		self.mainText.style.float = 'top'
		self.mainText.style.fontFamily = 'open sans, sans serif'
		self.mainText.style.fontWeight = 100			
		self.mainText.style.color = getRgba (white)
		document.body.appendChild (self.mainText)		

		self.header = document.createElement ('div')
		self.header.style.position = 'fixed'
		self.header.style.backgroundColor = getRgba (darkBrown)
		self.header.style.minHeight = self.minHeight
		document.body.appendChild (self.header)
		
		self.logo = document.createElement ('div')
		self.logo.style.position = 'absolute'
		self.logo.style.backgroundSize = 'cover'
		self.logo.style.backgroundImage = 'url("{}/monk_transcribing.png")'.format (self.imageDir)
		self.header.appendChild (self.logo)
		
		self.title = document.createElement ('div')
		self.title.style.position = 'absolute'
		self.title.innerHTML = self.titleContent
		self.header.appendChild (self.title)
		
		self.subtitle = document.createElement ('div')
		self.subtitle.style.position = 'absolute'
		self.subtitle.innerHTML = self.subtitleContent
		self.header.appendChild (self.subtitle)
		
		self.menuBar = document.createElement ('div')
		self.menuBar.style.position = 'absolute'
		self.menuBar.style.fontColor = getRgba (black)
		self.menuBar.style.backgroundColor = getRgba (white)
		self.header.appendChild (self.menuBar)
		
		self.buttons = []
		self.buttonLines = []
		self.nrOfButtons = len (self.mainTexts)
		for i in range (self.nrOfButtons):
			self.buttons [i] = document.createElement ('div')
			self.buttons [i] .style.position = 'absolute'
			self.buttons [i] .style.backgroundColor = 'none'
			self.buttons [i] .style.cursor = 'pointer'
			self.buttons [i] .style.padding = 0
			self.buttons [i] .onmouseover = (lambda menuIndex: lambda: self.hoverButton (menuIndex, True)) (i)
			self.buttons [i] .onmouseout = (lambda menuIndex: lambda: self.hoverButton (menuIndex, False)) (i)
			self.buttons [i] .onclick = (lambda menuIndex: lambda: self.setSubject (menuIndex)) (i) 
			self.menuBar.appendChild (self.buttons [i])

			self.buttonLines [i] = document.createElement ('div')
			self.buttonLines [i] .style.position = 'absolute'
			self.buttonLines [i] .style.fontFamily = 'open sans, arial, sans serif'			
			self.buttonLines [i] .style.fontWeight = 100
			self.buttonLines [i] .style.color = getRgba (black)
			self.buttonLines [i] .style.textAlign = 'center'			
			self.buttonLines [i] .style.cursor = 'pointer'
			self.buttonLines [i] .style.padding = 0
			self.buttons [i] .appendChild (self.buttonLines [i])
			
		self.setSubject (0)
		
		window.onresize = self.rightSize
		self.rightSize ()
		
	def rightSize (self):
		self.landscape = window.innerWidth > window.innerHeight and window.innerWidth > 400 
		
		self.header.style.left = 0
		self.header.style.top = 0
		self.header.style.width = '100%'
		self.header.style.height = 0.15 * window.innerHeight
					
		self.logo.style.top = 0.006 * window.innerHeight
		self.logo.style.height = 0.09 * window.innerHeight
		self.logo.style.width = 0.09 * window.innerHeight
		self.logo.style.left = 0.07 * window.innerWidth
		
		self.title.style.top = 0.006 * window.innerHeight
		self.title.style.height = 0.07 * window.innerHeight
		self.title.style.width = 0.4 * window.innerHeight
		self.title.style.left = 0.075 * window.innerWidth + 0.09 * window.innerHeight
		
		self.subtitle.style.top = 0.06 * window.innerHeight
		self.subtitle.style.height = 0.07 * window.innerHeight
		self.subtitle.style.width = 0.4 * window.innerHeight
		self.subtitle.style.left = 0.077 * window.innerWidth + 0.09 * window.innerHeight
		
		self.menuBar.style.top = 0.1 * window.innerHeight			
		self.menuBar.style.width = '100%'
		self.menuBar.style.height = 0.05 * window.innerHeight
		self.menuBar.style.borderTop = '1px solid #BBBBBB'
		self.menuBar.style.borderBottom = '1px solid #BBBBBB'
		
		self.buttonWidth = 1. / 7
		self.buttonCenters = [(i + 1) * self.buttonWidth for i in range (self.nrOfButtons)]
		
		for i in range (self.nrOfButtons):
			self.buttons [i].style.left = (self.buttonCenters [i] - self.buttonWidth / 2) * 0.99 * window.innerWidth
			self.buttons [i].style.top = 0
			self.buttons [i].style.width = self.buttonWidth * 0.99 * window.innerWidth
			self.buttons [i].style.height = 0.05 * window.innerHeight			

			self.buttonLines [i].style.left = 0
			self.buttonLines [i].style.top = 0.025 * window.innerHeight
			self.buttonLines [i].style.width = self.buttonWidth * window.innerWidth
			self.buttonLines [i].style.height = 0
			self.buttonLines [i].style.margin = 0
			self.buttonLines [i].style.lineHeight = 0
			
			if self.landscape:
				self.buttonLines [i].style.fontSize = Math.min (13, 0.013 * window.innerWidth)
				self.buttonLines [i].innerHTML = self.buttonWideTexts [i]
			else:
				self.buttonLines [i].style.fontSize = 0.03 * window.innerWidth
				self.buttonLines [i].innerHTML = self.buttonNarrowTexts [i]
				
		self.strip.style.top = 0.15 * window.innerHeight			
		self.strip.style.width = '100%'
		self.strip.style.height = 0.35 * window.innerHeight
		
		self.caption.style.left = 0
		self.caption.style.bottom = 0.05 * window.innerHeight
		self.caption.style.fontSize = 0.02 * window.innerWidth
		
		self.share.style.right = 0.02 * window.innerWidth		
		self.share.style.top = 0.53 * window.innerHeight
		

		self.caption.style.backgroundColor = getRgba (transparentLogoGreen)
		self.caption.innerHTML = 'Lean, fast, open!'
		
		if self.landscape:
			self.caption.style.visibility = 'visible'
		else:
			self.caption.style.visibility = 'hidden'
				
		if self.landscape:
			self.mainText.style.top = 0.57 * window.innerHeight
			self.mainText.style.width = 0.6 * window.innerWidth
			self.mainText.style.left = 0.2 * window.innerWidth
			tableDataFontSize = 0.012 * Math.sqrt (window.innerHeight * window.innerWidth)
			tableHeaderFontSize = 0.014 * Math.sqrt (window.innerHeight * window.innerWidth)
		else:
			self.mainText.style.top = 0.52 * window.innerHeight
			self.mainText.style.width = 0.8 * window.innerWidth
			self.mainText.style.left = 0.1 * window.innerWidth
			tableDataFontSize = 0.03 * Math.sqrt (window.innerHeight * window.innerWidth)
			tableHeaderFontSize = 0.04 * Math.sqrt (window.innerHeight * window.innerWidth)
			
		self.style.innerHTML = '''
			th {font-size:{}px; color:#000000; background-color:rgba(34,136,0,0.8); font_weight:normal; border:5px solid #aa7744;}
			td {font-size:{}px; vertical-align:top; color:#ffffff; padding:10px;}
		'''.format (int (tableHeaderFontSize), getRgba (black), getRgba (transparentLogoGreen), getRgba (lightBrown), int (tableDataFontSize), getRgba (white))
			
	def hoverButton (self, menuIndex, state):
		if state:
			if self.landscape:
				self.buttons [menuIndex] .style.backgroundColor = getRgba ()'E7E7E7'231,231,231,1
			else:
				self.buttons [menuIndex] .style.backgroundColor = getRgba'CCCCCC'208,208,208
		else:
			self.buttons [menuIndex] .style.backgroundColor = 'transparent'
				
	def setSubject (self, menuIndex):
		if self.mainText:
			self.mainText.innerHTML = self.mainTexts [menuIndex]
			
	def getMailLink (self, text):
		return '<div style="display:inline; color:#ffb000; cursor:pointer" onclick="location.href=\'mailto:{}\'">{}</div>'.format (self.mailAddress, text)
		
def onDocumentReady ():
	site = Site ()

