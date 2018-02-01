class A:
	arrival, stay, departure = range (3)

	def __init__ (self, situation):
		self.situation = situation
		
	def say (self):
		if self.situation == A.arrival:
			print ('\nHello,',)
		elif self.situation == A.stay:
			print ('\nHi again,',)
		else:
			print ('\nGoodbye,',)

class B:
	def __init__ (self, place):
		self.place = place
		
	def say (self):
		print (self.place,)

class C (A, B):
	def __init__ (self, situation, place):
		A.__init__ (self, situation)
		B.__init__ (self, place)
		
	def say (self):
		A.say (self)
		B.say (self)
		
	def shout (self):
		self.say ()
		print ('!',)
		
	def yell (self):
		C.say (self)
		print ('!!!',)

print ('\nUse multiple inheritance to combine features, not to achieve polymorphism...:')

comeHere = C (A.arrival, 'earth')
stayHere = C (A.stay, 'earth')
goHere = C (A.departure, 'earth')

comeThere = C (A.arrival, 'mars')
stayThere = C (A.stay, 'mars')
goThere = C (A.departure, 'mars')

comeHere.say ()
stayHere.say ()
goHere.say ()

print

comeThere.say ()
stayThere.say ()
goThere.say ()

print

goHere.shout ()
comeThere.yell ()
