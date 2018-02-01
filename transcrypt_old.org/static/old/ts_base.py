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

lightGray = getHex (245, 245, 245)
middleGray = getHex (231, 231, 231)
darkGray = getHex (208,208,208)

panoramaPink = getHex (229, 217, 217)
