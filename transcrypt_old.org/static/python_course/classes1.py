# Classes

class A:	# Old style
	def __init__ (self, x, y):
		self.x = x
		self.y = y
		
	def show (self):
		print (self.x, self.y)

class B (object):	# New style
	def __init__ (self, x, y):
		self.x = x
		self.y = y
		
	def show (self):
		print (self.x, self.y)
		
print ('\nSuperficially, old style and new style classes behave the same:')

a = A (1, 2)
print ('Old style:',)
a.show ()

b = B (3, 4)
print ('New style:',)
b.show ()

print ('Officially, properties and diamond inheritance are only required to work correctly for new style classes')
