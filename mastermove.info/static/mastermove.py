__pragma__ ('skip')
document = window = 0    # Prevent complaints by optional static checker
__pragma__ ('noskip')

backgroundColor = 'rgb(219,229,241)'
normalColor = 'rgb(0,0,0)'
accentColor = 'rgb(0,32,96)'
linkColor='rgb(0,0,255)'	
minHeight = 600

document.body.style.color = normalColor
document.body.style.fontFamily = 'lato, arial, sans serif'
document.body.style.fontWeight = 300
document.body.style.fontSize = 24
document.body.style.lineHeight = '140%'

for elem in document.querySelectorAll ('h1'):
	elem.style.color = accentColor
	elem.style.fontSize = 40
	elem.style.marginTop = 0
	elem.style.marginBottom = 0
	elem.style.paddingTop = 0
	elem.style.paddingBottom = 0

for elem in document.querySelectorAll ('h2'):
	elem.style.color = accentColor
	elem.style.fontSize = 26
	elem.style.marginTop = 0
	elem.style.marginBottom = 0
	elem.style.paddingTop = 0
	elem.style.paddingBottom = 0

for elem in document.querySelectorAll ('h3'):
	elem.style.color = accentColor
	elem.style.fontSize = 18
	elem.style.marginTop = 0
	elem.style.marginBottom = 0
	elem.style.paddingTop = 0
	elem.style.paddingBottom = 0

for elem in document.getElementsByClassName ('small'):
	elem.style.color = accentColor
	elem.style.fontSize = 20

for elem in document.querySelectorAll ('a'):
	elem.style.color = linkColor

for elem in document.querySelectorAll ('ul'):
	if elem.className == 'bulleted':
		elem.style.listStyleType = 'square'
	else:
		elem.style.listStyleType = 'none'
	
for elem in document.querySelectorAll ('table'):
	elem.style.fontSize = 20
		
def getElementByClassName (parent, name):
	elements = parent.getElementsByClassName (name)
	if len (elements):
		return elements [0]
	else:
		return None

def resize (self):
	pageWidth = window.innerWidth
	
	sectionWidth = min (pageWidth, 1000)
	sectionTop = 20
	sectionLeft = (pageWidth - sectionWidth) // 2
	
	for section in document.getElementsByClassName ('section'):
		section.style.position = 'absolute'
		section.style.width = sectionWidth
		section.style.top = sectionTop
		section.style.left = (pageWidth - sectionWidth) // 2
		section.style.backgroundColor = backgroundColor
	
		portrait = getElementByClassName (section, 'portrait')
		text = getElementByClassName (section, 'text')
		logo = getElementByClassName (section, 'logo')
		flag = getElementByClassName (section, 'flag')
			
		text.style.position = 'relative'
		text.style.padding = '10 20 10 20'

		flagHeight = 30
		if flag:
			flag.style.position = 'absolute'
			flag.style.height = flagHeight
			flag.style.bottom = 10
			flag.style.left = 20
		
		if logo:				
			logo.style.position = 'absolute'
			logoHeight = 130
			logo.style.height = logoHeight
			logo.style.top = -10
			logo.style.right = 20
			
			text.style.top = 10
						
			if portrait:
				portrait.style.position = 'absolute'
				portraitHeight = 270
				portrait.style.height = portraitHeight
				portrait.style.top = -10
				portrait.style.left = 20
				
				section.style.minHeight = portraitHeight + flagHeight + 20
				text.style.width = sectionWidth - 400
				text.style.left = 310
			else:
				section.style.minHeight = logoHeight + 20
				text.style.width = sectionWidth - 200
				
		else:
			text.style.width = sectionWidth - 40
			
		sectionTop += section.offsetHeight + 40
		
	section.style.marginBottom = 20	
	
window.onresize = resize
document.addEventListener ('DOMContentLoaded', resize)
document.body.style.visibility='visible'
