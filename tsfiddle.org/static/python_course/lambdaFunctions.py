print ('Lambda functions are very briefly formulated local functions with \'expression only\' syntax')
print

class AVeryBigClass_withLotsOfMemberFunctions:
	def lotsOfCode (self, manyMoreParams):
		doManyInterestingThings (self, lotsOfParams)
		doManyOtherInterestingThings (self, alsoLotsOfParams)

	def callBackWithTwoSuperfluousParams (self, param, anotherParam, aSecondSuperfluousParam):
		print (param, anotherParam, aSecondSuperfluousParam)

	def loopsWithCallBack (self):
		self.aLoop (lambda param, anotherParam: self.callBackWithTwoSuperfluousParams (param, anotherParam, 'if he wants to'))
		print
		self.anotherLoop (lambda param, anotherParam: self.callBackWithTwoSuperfluousParams (param, anotherParam, 'when she\'s home'))

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
			

			