print ('Python restores the tradition, interrupted by C and C++, of having local functions with arbitrarily deep nesting level')
print

class AVeryBigClass_withLotsOfMemberFunctions:
	def lotsOfCode (self, manyMoreParams):
		doManyInterestingThings (self, lotsOfParams)
		doManyOtherInterestingThings (self, alsoLotsOfParams)

	def loopsWithCallBack (self):
		def myCallBack_nicelyCloseToThePlaceWhereItsUsed (parameter, anotherParameter):
			print (parameter, anotherParameter)
	
		self.aLoop (myCallBack_nicelyCloseToThePlaceWhereItsUsed)
		print
		self.anotherLoop (myCallBack_nicelyCloseToThePlaceWhereItsUsed)

	def anotherMemberFunction_whichMakesYouLooseTrack_sinceThereAreSoManyOfThem (self, manyMoreParams):
		doManyInterestingThings (self, lotsOfParams)
		doManyOtherInterestingThings (self, alsoLotsOfParams)
		
	def aLoop (self, callBack):
		for person in ['John', 'Pete', 'Charles']:
			for activity in ['sleeps', 'eats', 'watches television']:
				callBack (person, activity)
			
	def anotherLoop (self, callBack):
		for person in ['Mary', 'Beth', 'Geraldine']:
			for activity in ['dreams', 'cooks', 'watches the children']:
				callBack (person, activity)
				
anObject = AVeryBigClass_withLotsOfMemberFunctions ()

anObject.loopsWithCallBack ()
			

			