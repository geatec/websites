from PIL import Image
import os
import sys

thumbNailHeight = int (sys.argv [1])

for dirPath, dirNames, fileNames in os.walk ('{}/../static'.format (os.getcwd () .replace ('\\', '/'))):
	if '/thumbnails/' in dirPath:
		continue
	
	dirPath = dirPath.replace ('\\', '/')
	thumbNailDirPath = dirPath.replace ('/static/', '/static/thumbnails/')
	
	for fileName in fileNames:
		if fileName.lower (). endswith ('.jpg'):
			if not os.path.exists (thumbNailDirPath):
				os.makedirs (thumbNailDirPath)
				
			image = Image.open ('{}/{}'.format (dirPath, fileName))
			image = image.resize ((image.size [0] * thumbNailHeight / image.size [1], thumbNailHeight), Image.ANTIALIAS)
			image.save ('{}/{}'.format (thumbNailDirPath, fileName), "JPEG")
			