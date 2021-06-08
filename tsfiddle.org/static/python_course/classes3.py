print ('In Python, polymorphism doesn\'t require a common base class (\'Dynamic\' tradition: Smalltalk, Objective C)')
print

class EnglishMan:
	def toast (self):
		print ('Here\'s to your health!')
		
	def remember (self):
		print ('Please do remember, the 5th of November!')
		
class GerMan:
	def toast (self):
		print ('Drei, vier, noch ein bier!')

	def party (self):
		print ('Wein, weib und gesang!')
		
class FrenchMan:
	def toast (self):
		print ('Sante!')
		
	def sing (self):
		print ('Alons enfants de la patrie!')
		
for man in [EnglishMan (), GerMan (), FrenchMan ()]:
	man.toast ()

	try:
		man.remember ()
	except:
		print ('Can\'t remember...')

	try:
		man.party ()
	except:
		print ('Can\'t party...')

	try:
		man.sing ()
	except:
		print ('Can\'t sing...')
		
	print
