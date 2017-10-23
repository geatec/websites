def getRgba (*color):
	return 'rgba({},{},{},{})'.format (*color)
	
def getHex (*color):
	result = ''
	for component in color [:3]:
		result += hexDigits [component // 16] + hexDigits [component % 16]
	return result
	
hexDigits = '0123456789abcdef'

black = getHex (0,0,0,1)
white = getHex (255, 255, 255, 1)

logoRed = getHex (255, 68, 34, 1)
logoGreen = getHex (34, 136, 0, 1)
logoBlue = getHex (51, 102, 255, 1)
logoYellow = getHex (255, 176, 0, 1)

darkBrown = getHex (102, 68, 34, 1)
lightBrown = getHex (170, 119, 68, 1)

transparentLogoGreen = getRgba (34, 136, 0, 0.8)
veryTransparentLogoGreen = getRgba (34, 136, 0, 0.1)

transparentLogoBlue = getRgba (51, 102, 255, 0.7)
veryTransparentLogoBlue = getRgba (51, 102, 255, 0.1)

lightGray = getHex (245, 245, 245)
middleGray = getHex (231, 231, 231)
darkGray = getHex (208,208,208)
splashGray = getHex (90, 90, 90)
fixedGray = getHex (60, 60, 60)

panoramaPink = getHex (229, 217, 217)
panoramaPurple = getHex (41, 23, 23)

class Stripe:
	def __init__ (self, colors = [white, lightGray]):
		self.colors = colors;
		self.nColors = len (self.colors)
		self.iColor = -1

	def __call__ (self):
		self.iColor = (self.iColor + 1) % self.nColors
		return self.colors [self.iColor]
		
def indent (plainText):
	return '\n'.join (['    ' + line for line in plainText.replace ('\t', '    ') .split ('\n')])
		
def encodeTags (plainText):
	return plainText.replace ('<', '&lt;') .replace ('>', '&gt;')

def decodeTags (encodedText):
	return encodedText.replace ('&lt;', '<') .replace ('&gt;', '>')
		