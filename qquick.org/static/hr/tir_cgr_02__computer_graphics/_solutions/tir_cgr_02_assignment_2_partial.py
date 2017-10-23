import os

nRows, nColumns = 24, 78

class Image ():
	def __init__ (self, nRows, nColumns):
		self.nRows, self.nColumns = nRows, nColumns
		self.clear ()
		
	def clear (self):
		self.buffer = [[' ' for iColumn in range (nColumns)] for iRow in range (nRows)]
		os.system (['clear','cls'][os.name == 'nt'])
		
	def point (self, x, y, aChar):
		self.buffer [int (x)][int (y)] = aChar

	def line (self, x0, y0, x1, y1, aChar):
		direction = (y1 - y0) / float (x1 - x0) if (x1 - x0) else None
		
		if direction == None:
			for y in range (y0, y1, 1 if y1 > y0 else -1):
				self.point (x0, y, aChar)
		elif -1 < direction and direction < 1:
			support = y0 - direction * x0
			for x in range (x0, x1, 1 if x1 > x0 else -1):
				self.point (x, support + direction * x, aChar)
		else:
			support = x0 - y0 / direction
			for y in range (y0, y1, 1 if y1 > y0 else -1):
				self.point (support + y/direction, y, aChar)
			
	def render (self):
		for row in reversed (self.buffer):
			rowString = ''.join (row)
			print rowString
				
image = Image (nRows, nColumns)

image.line (0, 0, 20, 60, '0')
image.line (0, 60, 20, 0, '1')

image.line (0, 0, 20, 10, '2')
image.line (0, 15, 20, 0, '3')

image.line (10, 0, 10, 50, '4')
image.line (0, 10, 20, 10, '5')

image.render ()
